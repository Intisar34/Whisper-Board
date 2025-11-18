
const express = require('express');
const router = express.Router();

// Imports comment controller functions
const {
    createComment,
    getComments,
    getCommentByID,
    deleteCommentByID,
    updateComment
} = require('../controllers/commentController');

router.post("/", createComment)
router.get("/", getComments);
router.get("/:id", getCommentByID);
router.delete("/:id", deleteCommentByID);
router.put("/:id", updateComment);

module.exports = router; 