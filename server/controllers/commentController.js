const Comments = require('../models/commentModel');
const Posts = require('../models/postModel');
const Users = require('../models/userModel');

// Creates a comment
exports.createComment = async (req, res, next) => {
    try {
        
        const comment = new Comments (req.body);
        const newComment = await comment.save(req.body);
        res.status(201).json({comment: newComment});
    } catch (err) {
        next(err);
    }
};

// Gets either all comments or filters by userID/postId
exports.getComments = async (req, res, next) => {
    try {
        const allowed_filters = ["userID", "postID"];
        const filter = {}

        allowed_filters.forEach(key => {
            if (req.query[key]) {
                filter[key] = req.query[key]
            }

        });

        if (filter.userID) {
        const checkUser = await Users.findById(filter.userID);
        if (!checkUser) {
            return res.status(404).json({error: "User not found!"});
        }
        }

        if (filter.postID) {
            const checkPost = await Posts.findById(filter.postID);
            if (!checkPost) {
                return res.status(404).json({error: "Post not found!"});
            }
        }

        const comments = await Comments.find(filter);
        res.status(200).json({comments: comments});


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
        res.status(200).json({comment: comment});
    } catch(err) {
        next(err);
    }
};

// Updates comment 
exports.updateComment = async (req, res, next) => {
    try {
        const {id} = req.params;
        const updatedComment = await Comments.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});

        if (!updatedComment) {
            return res.status(404).json({error: "Comment not found!"});
        } 

        res.json({comment: updatedComment});
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
        const { postID, parentComment } = req.params;
        const { body, username } = req.body;

        const checkPost = await Posts.findById(postID);
        if (!checkPost) {
            return res.status(404).json({error: "Post not found!"});
        }


        const checkUser = await Users.findOne({username});
        if (!checkUser) {
            return res.status(404).json({error: "User not found!"});
        }

        const newComment = await Comments.create({
            body,
            postID,
            userID: checkUser._id,
            parentComment: parentComment || null
        });

        res.status(201).json({comment: newComment});
    } catch (err) {
        next(err);
    }
};

// Get all comments for a specific post (relationship)
exports.getPostComments = async (req, res, next) => {
    try {
        const { postID } = req.params;

        const checkPost = await Posts.findById(postID);
        if (!checkPost) {
            return res.status(404).json({error: "Post not found!"});
        }

        let comments = await Comments.find({ postID })
          .populate('userID', 'username');
        
        // Only populate parentComment if it exists
        comments = await Promise.all(
          comments.map(async (comment) => {
            if (comment.parentComment) {
              const parent = await Comments.findById(comment.parentComment)
                .populate('userID', 'username');
              return { ...comment.toObject(), parentComment: parent };
            }
            return comment.toObject();
          })
        );

        res.status(200).json({comments: comments});
    } catch (err) {
        next(err);
    }
};

// Get a single comment in a specific post (relationship)
exports.getPostCommentById = async (req, res, next) => {
    try {
        const { postID, commentID } = req.params;

        const checkPost = await Posts.findById(postID);
        if (!checkPost) {
            return res.status(404).json({error: "Post not found!"});
        }

        const comment = await Comments.findOne({ _id: commentID, postID });
        if (!comment) {
            return res.status(404).json({error: "Comment not found in this post!"});
        }

        res.status(200).json({comment: comment});
    } catch (err) {
        next(err);
    }
};

// Delete comment inside a post (relationship)
exports.deletePostComments = async (req, res, next) => {
    try {
        const { postID, commentID } = req.params;

        const checkPost = await Posts.findById(postID);
        if (!checkPost) {
            return res.status(404).json({error: "Post not found!"});
        }

        const deleteComment = await Comments.findOneAndDelete({ _id: commentID, postID});
        if (!deleteComment) {
            return res.status(404).json({error: "Comment not found in this post!"});
        }

        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

// Create comments for specific user (relationship)
exports.createUserSpecificComment = async (req, res, next) => {
    try{
        const username = req.params.username;
        const {body, postID, parentComment} = req.body;

        const checkUser = await Users.findOne({username});
        if (!checkUser) {
            return res.status(404).json({error: "User not found!"});
        }

        const newComment = await Comments.create({
            body,
            postID,
            userID: checkUser._id,
            parentComment: parentComment || null

        });

        res.status(201).json({comment: newComment});      
} catch (err) {
    next(err);
}
};

//GET: Get all comments from a specific user (relationship)
exports.getUserComments = async (req, res, next) => {
    try {
        const { username } = req.params;
        const user = await Users.findOne({username});

        if(!user) {
            return res.status(404).json({error: "User not found"})
        }

        const comments = await Comments.find({userID: user._id})

        return res.status(200).json(comments)

    } catch (err) {
        next(err);
    }
}


// Like a comment
exports.likeComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { userID } = req.body;

        if (!userID) {
            return res.status(400).json({ error: 'UserID is required' });
        }

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // If already liked, unlike, if not, like and pull dislike.
        if (comment.likes.includes(userID)) {
            comment.likes.pull(userID);
        } else {
            comment.likes.push(userID);
            comment.dislikes.pull(userID);
        }

        await comment.save();
        res.status(200).json(comment);
    } catch (err) {
        next(err);
    }
};

// Dislike a comment
exports.dislikeComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { userID } = req.body;

        if (!userID) {
            return res.status(400).json({ error: 'UserID is required' });
        }

        const comment = await Post.findById(id);

        if (!comment) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // if already disliked, undislike, if not, dislike and pull like.
        if (comment.dislikes.includes(userID)) {
            comment.dislikes.pull(userID);
        } else {
            comment.dislikes.push(userID);
            comment.likes.pull(userID);
        }

        await comment.save();
        res.status(200).json(comment);
    } catch (err) {
        next(err);
    }
};

