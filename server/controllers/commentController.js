
const Comments = require('../models/commentModel');

// Creates a comment
exports.createComment = async (req, res, next) => {
    try {
        
        const comment = new Comments (req.body);
        const newComment = await comment.save(req.body);
        res.status(201).json({data: newComment});
    } catch (err) {
        next(err);
    }
};

// Gets either all comments or filters by userId/postId
exports.getComments = async (req, res, next) => {
    try {
        const allowed_filters = ["userID", "post_id"];
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
        const { post_id } = req.params;
        const { body, userID } = req.body;

        const comment = await Comments.create({
            body,
            post_id,
            userID
        });

        res.status(201).json(comment);
    } catch (err) {
        next(err);
    }
};

// Get all comments for a specific post (relationship)
exports.getPostComments = async (req, res, next) => {
    try {
        const { post_id } = req.params;

        const comments = await Comments.find({ post_id });
        res.status(200).json(comments);
    } catch (err) {
        next(err);
    }
};

// Get a single comment in a specific post (relationship)
exports.getPostCommentById = async (req, res, next) => {
    try {
        const { post_id, comment_id } = req.params;

        const comment = await Comments.findOne({ _id: comment_id, post_id });
        if (!comment) {
            return res.status(404).json({ error: "Comment not found in this post!" });
        }

        res.status(200).json(comment);
    } catch (err) {
        next(err);
    }
};

// Delete comment inside a post (relationship)
exports.deletePostComments = async (req, res, next) => {
    try {
        const { post_id, comment_id } = req.params;

        const comment = await Comments.findOneAndDelete({ _id: comment_id, post_id });
        if (!comment) {
            return res.status(404).json({ error: "Comment not found in this post!" });
        }

        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
