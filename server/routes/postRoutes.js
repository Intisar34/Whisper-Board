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
    getUserPostById,
    getForumPosts,
    getForumPostById,
    deleteForumPost

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
router.delete("/users/:username/posts/:post_id", deleteUserSpecificPost);

router.post("/forums/:forumID/posts", createPostInForum);
router.get("/forums/:forumID/posts", getForumPosts);
router.get("/forums/:forumID/posts/:post_id", getForumPostById);
router.delete("/forums/:forumID/posts/:post_id", deleteForumPost);

module.exports = router;