const express = require('express');
const router = express.Router();

// Imports comment controller functions
const {
    createComment,
    getComments,
    getCommentByID,
    deleteCommentByID,
    updateComment,
    likeComment,
    dislikeComment
} = require('../controllers/commentController');

router.post("/", createComment);
router.get("/", getComments);
router.get("/:id", getCommentByID);
router.delete("/:id", deleteCommentByID);
router.put("/:id", updateComment);
router.patch("/:id/like", likeComment);
router.patch("/:id/dislike", dislikeComment)

module.exports = router;
