const express = require('express');
const router = express.Router();

const {
    createPost,
    getAllPosts,
    deleteAllPosts,
    getPost,
    updatePost,
    patchPost,
    deletePost,
} = require("../controllers/postController");

router.post("/", createPost);
router.get("/", getAllPosts);
router.delete("/", deleteAllPosts)
router.get("/:id", getPost);
router.put("/:id", updatePost);
router.patch("/:id", patchPost);
router.delete("/:id",deletePost);


module.exports = router;