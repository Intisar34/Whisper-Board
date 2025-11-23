
const Forum = require('../models/forumModel');
const Post = require('../models/postModel');

// Creates a forum
exports.createForums = async (req, res, next) =>{
    try {
        const forums = new Forum(req.body);
        const saveForum = await forums.save();

        res.status(201).json(saveForum) 
    } catch (err) {
        next(err);

    }
}; 

// Gets all forums
exports.getForums = async (req, res, next) => {
    try {
        const forums = await Forum.find();

        res.status(200).json({data:forums});
    } catch(err) {
        next(err);
    }
};

// Gets specific forum
exports.getForumByID = async (req, res, next) => {
    try {
        const {id} = req.params;
        const forum = await Forum.findById(id);

        if(!forum){
            return res.status(404).json({error: "Forum not found!"});
        }

        res.json({data:forum});
    } catch(err) {
        next(err);
    }
};

// Updates forums 
exports.updateForum = async (req, res, next) => {
    try {
        const {id} = req.params;
        const forum = await Forum.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});

        if (!forum) {
            return res.status(404).json({error: "Forum not found!"});
        } 
        
        res.status(200).json({data:forum});
        } catch (err) {
            next (err);
        }
};

// Deletes specific forum
exports.deleteForumByID = async (req, res, next) => {
    try {
        const {id} = req.params;
        const forum = await Forum.findByIdAndDelete(id);

        if(!forum) {
            return res.status(404).json({error: "Forum not found!"});
        } 
        
        else {
            res.status(204).send();
        }

        } catch (err) {
            next(err);
    }
};

// Updates a forums field
exports.updateForumField = async (req, res, next) => {
    try {
        const {id} = req.params;
        const forum = await Forum.findByIdAndUpdate(id, {$set: req.body}, {new: true, runValidators: true});

        if(!forum) {
            return res.status(404).json({error: "Forum not found!"});

        }
        res.status(200).json({data:forum});

      } catch (err) {
          next (err);
      }
};


// Get all posts inside a forum
exports.getForumPosts = async (req, res, next) => {
    try {
        const {forum_id} = req.params;
        const posts = await Post.find({forumID: forum_id})

        res.status(200).json({data: posts});
    } catch (err) {
        next(err);
    }
};

// Create posts inside a forum
exports.createForumPosts = async (req, res, next) => {
    try {
        const {forum_id} = req.params;
        const post = new Post({
            title: req.body.title,
            body: req.body.body,
            forumID: forum_id
        });

        const savePost = await post.save();
        res.status(201).json(savePost);
    } catch (err) {
        next (err);
    }
};