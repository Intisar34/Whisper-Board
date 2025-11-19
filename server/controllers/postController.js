const Post = require('../models/postModel');

//POST: Create a post.
exports.createPost =  async (req,res, next) => { 
    try{
        const post = new Post(req.body);
        const savedPost = await post.save();

        res.status(201).json(savedPost) 
    } catch (err) {
        next(err);

    }
}; 

//GET: Get all posts.
exports.getAllPosts = async (req,res,next) => {
    try{
        const getPosts = await Post.find()      
      
        res.status(200).json({ getPosts });
    } catch(err) {
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

//GET: Get a specific Post.
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



