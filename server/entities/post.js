var express = require('express');
var router = express.Router();
var Post = require('../models/postsModel');

router.post('/api/posts', async function(req,res, next){ 
    console.log('Recieved POST request'); 
    try{
        var post = new Post(req.body);
        var savedPost = await post.save();

        res.status(201).json(savedPost) 

    } catch (err) {
        next(err);
    }
});

module.exports = router;