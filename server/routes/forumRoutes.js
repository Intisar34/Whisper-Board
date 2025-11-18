
const express = require("express");
const router = express.Router();

// Imports forum controller functions
const {
    getForums,
    getForumByID,
    deleteForumByID,
    updateForum
} = require("../controllers/forumController");

router.get("/", getForums);
router.get("/:id", getForumByID);
router.delete("/:id", deleteForumByID);
router.put("/:id", updateForum);

module.exports = router;