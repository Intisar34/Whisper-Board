
const Comments = require('../models/commentModel');

// Creates a comment
exports.createComment = async (req, res, next) => {
    try {
        const comment = await Comments.save(req.body);
        res.status(201).json({data: comment});
    } catch (err) {
        next(err);
    }
};

// Gets either all comments or filters by userId/postId
exports.getComments = async (req, res, next) => {
    try {
        const allowed_filters = ["user_id", "post_id"];
        const filter = {}

        allowed_filters.forEach(key => {
            if (req.query[key]) {
                filter[key] = req.query[key]
            }
        })

        const comments = await Comments.find(filter);
        res.json({data: comments});

    } catch(err) {
        next(err);
    }
};

// Gets specific comments by ID
exports.getCommentByID = async (req, res, next) => {
    try {
        const {id} = req.params;
        const comment = await Comments.findById(id);

        if(!comment){
            return res.status(404).json({error: "Comment not found!"});
        }
        res.json({data: comment});
    } catch(err) {
        next(err);
    }
};

// Updates comment 
exports.updateComment = async (req, res, next) => {
    try {
        const {id} = req.params;
        const comment = await Comments.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});

        if (!comment) {
            return res.status(404).json({error: "Comment not found!"});
        } 

        res.json({data: comment});
        } catch (err) {
            next (err);
        }
};

// Deletes comment by ID
exports.deleteCommentByID = async (req, res, next) => {
    try {
        const {id} = req.params;
        const comment = await Comments.findByIdAndDelete(id);

        if(!comment) {
            return res.status(404).json({error: "Comment not found!"});
        } 
        
        else {
            res.status(204).send();
        }

        } catch (err) {
            next(err);
    }
};


// Create comments inside a post (relationship)
exports.createPostComments = async (req, res, next) => {
    try {
        const {post_id} = req.params;
        const comment = new Comment({
            body: req.body.body,
            post_id: post_id
        });

        const saveComment = await comment.save();
        res.status(201).json(saveComment);
    } catch (err) {
        next (err);
    }
};