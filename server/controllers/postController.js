const Post = require('../models/postModel');

// POST: Create a post.
exports.createPost =  async (req,res, next) => { 
    try{
        const post = new Post(req.body);
        const savedPost = await post.save();

        res.status(201).json(savedPost) 
    } catch (err) {
        next(err);

    }
}; 

// GET: Get all posts with optional sorting.
exports.getAllPosts = async (req,res,next) => {
    try{
        const query = req.query.sort || null;

        let getPosts

        if(query){
            getPosts = await Post.find().sort(query)
        } else {
            getPosts = await Post.find();
        }

        res.status(200).json(getPosts);

    } catch(err){
        next(err);
    }
};

// DELETE: Delete all posts.
exports.deleteAllPosts = async (req,res,next) => {
    try{
        const results = await Post.deleteMany({});
        
        res.status(200).json({message: " All posts have been deleted", deletedCount: results.deletedCount})
    } catch(err){
        next(err);
    }
};

// GET: Get a specific Post.
exports.getPost = async (req,res,next) => {
    try{
        const postID = req.params.id;// get id from URL
        const uniquePost = await Post.findById(postID); //find the post by ID   
      
        if(!uniquePost){
        return res.status(404).json({message: "'Post not found"})
        }
        res.status(200).json({ uniquePost });
    } catch(err) {
        next(err);
    }
};

// GET: All posts for a specific user
exports.getUserPosts = async (req, res, next) => {
    try {
        const { username } = req.params;
        const posts = await Post.find({ userID: username });

        res.status(200).json(posts);
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
            res.status(404).json({message: "Not found"})
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
            return res.status(404).json({message: "Post not found"})
        }
        
        res.status(200).json({updatedPost: newPost, message: "Post has been succesfully updated"})
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
            return res.status(404).json({message: "Not found"})
        };

        res.status(200).json({newField: newData});
    } catch(err){
        next(err)
    }
};

// POST: Create a post for a specific user.
exports.createPostForUser = async (req,res,next) => {
    try{
        const username = req.params.username;
        const post = new Post({
            title: req.body.title,
            body: req.body.body,
            userID: username,
            forumID: req.body.forumID
    });  
        const savedPost = await post.save()

        res.status(201).json(savedPost)
    } catch(err){
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
            userID: req.body.userID, // OR you may get this from auth later
            forumID: forumID            // comes from URL
        });

        res.status(201).json(newPost);

    } catch (err) {
        next(err);
    }
};

// DELETE: Delete specific post from a specific user.
exports.deleteUserSpecificPost = async (req, res, next) => {
    try {
        const username = req.params.username;
        const postId = req.params.post_id;

        // Find the post
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check relationship: only delete if it belongs to the user
        if (post.userID !== username) {
            return res.status(403).json({ message: 'You cannot delete a post that is not yours.' });
        }

        await Post.findByIdAndDelete(postId);

        res.status(204).send(); // No content, success
    } catch (err) {
        next(err);
    }
};



