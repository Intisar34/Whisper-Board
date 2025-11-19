const express = require('express');
const router = express.Router();
const Post = require('../models/postsModel');

//Create a post
router.post('/api/posts', async function(req,res, next){ 
    console.log('Recieved POST request'); 
    try{
        const post = new Post(req.body);
        const savedPost = await post.save();

        res.status(201).json(savedPost) 
    } catch (err) {
        next(err);

    }
}); 

//Get all posts
router.get('/api/posts', async function(req,res,next){
    try{
      const getPosts = await Post.find()      
      res.status(200).json({ getPosts });
    } catch(err) {
        next(err);
    }
});

//Get specific Post
router.get('/api/posts/:id', async function(req,res,next){
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
});

// Delete all posts.
router.delete('/api/posts', async function(req,res,next){
    try{
        const results = await Post.deleteMany({});
        res.status(200).json({message: " All posts have been deleted", deletedCount: results.deletedCount})
    } catch(err){
        next(err);
    }
});

 // Delete a specific post by ID
router.delete('/api/posts/:id', async function(req,res,next){
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
});

// Replace a post by ID. 
router.put('/api/posts/:id', async function(req,res,next){
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
});

// Update specific fields in post by ID
router.patch('/api/posts/:id', async function(req,res,next){
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
});

module.exports = router;

