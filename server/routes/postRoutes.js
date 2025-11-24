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
    createPostForUser,
    createPostInForum,
    deleteUserSpecificPost,
    getUserPosts,
    getUserPostById

} = require("../controllers/postController");

router.post("/posts", createPost);
router.get("/posts", getAllPosts);
router.delete("/posts", deleteAllPosts)
router.get("/posts/:id", getPost);
router.delete("/posts/:id",deletePost);
router.put("/posts/:id", updatePost);
router.patch("/posts/:id", patchPost);


// Extra relationship routes
router.get("/users/:username/posts", getUserPosts);
router.get("/users/:username/posts/:post_id", getUserPostById);
router.post("/users/:username/posts", createPostForUser);
router.post("/forums/:forumID/posts", createPostInForum);
router.delete("/users/:username/posts/:post_id", deleteUserSpecificPost);

module.exports = router;