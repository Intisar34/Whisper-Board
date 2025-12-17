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
    joinForum,
    leaveForum
} = require("../controllers/forumController");

router.post("/", createForums)
router.get("/", getForums);
router.get("/:id", getForumByID);
router.delete("/:id", deleteForumByID);
router.put("/:id", updateForum);
router.patch("/:id", updateForumField);
router.patch("/:id/join", joinForum);
router.patch("/:id/leave", leaveForum);

module.exports = router;