
const express = require('express');
const router = express.Router();

// Imports comment controller functions
const {
    createComment,
    getComments,
    getCommentByID,
    deleteCommentByID,
    updateComment,
    createPostComments
} = require('../controllers/commentController');

router.post("/", createComment)
router.get("/", getComments);
router.get("/:id", getCommentByID);
router.delete("/:id", deleteCommentByID);
router.put("/:id", updateComment);

// Relationship routes
router.post("/posts/:post_id/comments", createPostComments);

module.exports = router; 