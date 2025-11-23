
const express = require("express");
const router = express.Router();

// Imports forum controller functions
const {
    createForums,
    getForums,
    getForumByID,
    deleteForumByID,
    updateForum,
    updateForumField,
    getForumPosts,
    createForumPosts
} = require("../controllers/forumController");

router.post("/", createForums)
router.get("/", getForums);
router.get("/:id", getForumByID);
router.delete("/:id", deleteForumByID);
router.put("/:id", updateForum);
router.patch("/:id", updateForumField);

// Realationship routes
router.get("/forums/:forum_id/posts", getForumPosts)
router.post("/forums/:forum_id/posts", createForumPosts)


module.exports = router;