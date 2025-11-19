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

