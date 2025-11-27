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
    deleteForumPost,

} = require("../controllers/postController");

const {
  createPostComments,
  getPostComments,
  getPostCommentById,
  deletePostComments,
  createUserSpecificComment
} = require("../controllers/commentController");

router.post("/posts", createPost);
router.get("/posts", getAllPosts);
router.delete("/posts", deleteAllPosts)
router.get("/posts/:id", getPost);
router.delete("/posts/:id",deletePost);
router.put("/posts/:id", updatePost);
router.patch("/posts/:id", patchPost);


// Extra relationship routes
router.get("/users/:userID/posts", getUserPosts);
router.get("/users/:userID/posts/:post_id", getUserPostById);
router.post("/users/:userID/posts", createPostForUser);
router.delete("/users/:userID/posts/:post_id", deleteUserSpecificPost);
router.post("/users/:userID/comments", createUserSpecificComment)

router.post("/forums/:forumID/posts", createPostInForum);
router.get("/forums/:forumID/posts", getForumPosts);
router.get("/forums/:forumID/posts/:post_id", getForumPostById);
router.delete("/forums/:forumID/posts/:post_id", deleteForumPost);

router.post("/posts/:post_id/comments", createPostComments);
router.get("/posts/:post_id/comments", getPostComments);
router.get("/posts/:post_id/comments/:comment_id", getPostCommentById);
router.delete("/posts/:post_id/comments/:comment_id", deletePostComments);

module.exports = router;