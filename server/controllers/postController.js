const Post = require('../models/postModel');
const User = require('../models/userModel');
const Forum = require('../models/forumModel');

// POST: Create a post.
exports.createPost =  async (req,res, next) => { 
    try{
        const post = new Post(req.body);
        const savedPost = await post.save();

        res.status(201).json(savedPost);
    } catch (err) {
        if(err.name === "ValidationError"){
            return res.status(400).json({
                error: "Missing required fields",
                details: err.message
            })
        }
        next(err);
    }
}; 

// GET: Get all posts with optional sorting and user feed filtering.
exports.getAllPosts = async (req,res,next) => {
    try{
        const sortQuery = req.query.sort || null;
        const userId = req.query.userId || null;

        let filter = {};

        // If userId is given filter posts by forums the user has joined
        if (userId) {
            const joinedForums = await Forum.find({ members: userId }).select('_id');
            const joinedForumIds = joinedForums.map(f => f._id);
            filter.forumID = { $in: joinedForumIds };
        }

        let query = Post.find(filter);

        if(sortQuery){
            query = query.sort(sortQuery);
        }

        const getPosts = await query.exec();

        res.status(200).json(getPosts);
    } catch(err){
        next(err);
    }
};

// DELETE: Delete all posts.
exports.deleteAllPosts = async (req,res,next) => {
    try{
        const results = await Post.deleteMany({});
        
        res.status(200).json({message: "All posts have been deleted", deletedCount: results.deletedCount})
    } catch(err){
        next(err);
    }
};

// GET: Get a specific Post.
exports.getPost = async (req,res,next) => {
    try{
        const postID = req.params.id;// get id from URL
        const specificPost = await Post.findById(postID); // find the post by ID   
      
        if(!specificPost){
        return res.status(404).json({error: "Post not found"})
        }

        res.status(200).json({ specificPost });
    } catch(err) {
        next(err);
    }
};

// GET: All posts for a specific user
exports.getUserPosts = async (req, res, next) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({username});

        if(!user){
           return res.status(404).json({error: "User not found"});
        }

        const posts = await Post.find({ userID: user._id}).populate('forumID');

        res.status(200).json(posts);
    } catch (err) {
        next(err);
    }
};

// GET: Single post for a specific user
exports.getUserPostById = async (req, res, next) => {
    try {
        const { username, postID } = req.params;
        const user = await User.findOne({username});

        if(!user){
           return res.status(404).json({error: "User not found"});
        }

        const post = await Post.findOne({ _id: postID, userID: user._id });
        
        if (!post) {
            return res.status(404).json({ error: "Post not found for this user" });
        }

        res.status(200).json(post);
    } catch (err) {
        next(err);
    }
};

 // DELETE: Delete a specific post by ID.
exports.deletePost = async(req,res,next) => {
    try{
        const postID = req.params.id;
        const deletedItem = await Post.findByIdAndDelete(postID)

        if(!deletedItem){
            return res.status(404).json({error: "Post not found"})
        }

        res.status(200).json({message: "Successfully deleted", deletedItem})
    } catch(err){
        next(err);
    }
};

// PUT: Replace a post by ID. 
exports.updatePost = async(req,res,next) => {
    try{
        const oldPost = req.params.id;
        const newPost = await Post.findByIdAndUpdate(
            oldPost,req.body, {
                new: true, // return the updated document.
                overwrite: true // replace the whole document with the new body.
            }
        );

        if(!newPost){
            return res.status(404).json({error: "Post not found"})
        }
        
        res.status(200).json({updatedPost: newPost, message: "Post has been successfully updated"})
    } catch(err){
        next(err);
    }
};

// PATCH: Update specific fields in post by ID.
exports.patchPost = async (req,res,next) => {
    try{
        const postID = req.params.id;
        const newData = await Post.findByIdAndUpdate(
            postID, {$set: req.body},{new: true}
        );

        if(!newData){
            return res.status(404).json({error: "Post not found"})
        };

        res.status(200).json({update: newData, message: "Post has been successfully updated"});
    } catch(err){
        next(err)
    }
};

// POST: Create a post for a specific user.
exports.createPostForUser = async (req,res,next) => {
    try{
        const username = req.params.username;
        const user = await User.findOne({ username });

        if(!user){
           return res.status(404).json({error: "User not found"});
        }

        const post = await Post.create({
            title: req.body.title,
            body: req.body.body,
            userID: user._id,
            forumID: req.body.forumID
    });  
    
        res.status(201).json(post)
    } catch(err){
        
        if(err.name === "ValidationError"){
            return res.status(400).json({
                error: "Missing required fields",
                details: err.message
            })
        }
        next(err); 
    }
};

// POST: Create a post in a specific forum.
exports.createPostInForum = async (req, res, next) => {
    try {
        const forumID = req.params.forumID;
        const newPost = await Post.create({
            title: req.body.title,
            body: req.body.body,
            userID: req.body.userID,
            forumID: forumID          
        });

        res.status(201).json(newPost);

    } catch (err) {
        
        if(err.name === "ValidationError"){
            return res.status(400).json({
                error: "Missing required fields",
                details: err.message
            })
        }
        next(err);
    }
};

// DELETE: Delete specific post from a specific user.
exports.deleteUserSpecificPost = async (req, res, next) => {
    try {
        const username = req.params.username;
        const postId = req.params.postID;
        
        const user = await User.findOne({username});
        
        if(!user){
           return res.status(404).json({error: "User not found"});
        }

        // Find the post
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check relationship: only delete if it belongs to the user
        if (!post.userID.equals(user._id)) {
            return res.status(403).json({ error: 'You cannot delete a post that is not yours.' });
        }

        await Post.findByIdAndDelete(postId);

        res.status(204).send(); // No content, success
    } catch (err) {
        next(err);
    }
};

// GET: All posts in a specific forum
exports.getForumPosts = async (req, res, next) => {
    try {
        const { forumID } = req.params;
        const sortQuery = req.query.sort || null;

        const posts = await Post.find({ forumID: forumID }).sort(sortQuery);

        res.status(200).json(posts);
    } catch (err) {
        next(err);
    }
};

// GET: Single post in a specific forum
exports.getForumPostById = async (req, res, next) => {
    try {
        const { forumID, postID } = req.params;

        const post = await Post.findOne({ _id: postID, forumID: forumID });
        if (!post) {
            return res.status(404).json({ error: 'Post not found in this forum' });
        }

        res.status(200).json(post);
    } catch (err) {
        next(err);
    }
};

// DELETE: Delete a post from a specific forum
exports.deleteForumPost = async (req, res, next) => {
    try {
        const { forumID, postID } = req.params;

        const post = await Post.findOne({ _id: postID, forumID: forumID });
        if (!post) {
            return res.status(404).json({ error: 'Post not found in this forum' });
        }

        await Post.findByIdAndDelete(postID);

        res.status(204).send();
    } catch (err) {
        next(err);
    }
};


// PATCH: Like a post
exports.likePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { userID } = req.body;

        if (!userID) {
            return res.status(400).json({ error: 'UserID is required' });
        }

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // if already liked, unlike, if not, like and pull dislike.
        if (post.likes.includes(userID)) {
            post.likes.pull(userID);
        } else {
            post.likes.push(userID);
            post.dislikes.pull(userID);
        }

        await post.save();
        res.status(200).json(post);
    } catch (err) {
        next(err);
    }
};

// PATCH: Dislike a post
exports.dislikePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { userID } = req.body;

        if (!userID) {
            return res.status(400).json({ error: 'UserID is required' });
        }

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // if already disliked, undislike, if not, dislike and pull like.
        if (post.dislikes.includes(userID)) {
            post.dislikes.pull(userID);
        } else {
            post.dislikes.push(userID);
            post.likes.pull(userID);
        }

        await post.save();
        res.status(200).json(post);
    } catch (err) {
        next(err);
    }
};
