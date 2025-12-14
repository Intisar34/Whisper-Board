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
    likePost,
    dislikePost

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
router.patch("/posts/:id/like", likePost);
router.patch("/posts/:id/dislike", dislikePost);


// Extra relationship routes
router.get("/users/:username/posts", getUserPosts);
router.get("/users/:username/posts/:postID", getUserPostById);
router.post("/users/:username/posts", createPostForUser);
router.delete("/users/:username/posts/:postID", deleteUserSpecificPost);
router.post("/users/:username/comments", createUserSpecificComment)

router.post("/forums/:forumID/posts", createPostInForum);
router.get("/forums/:forumID/posts", getForumPosts);
router.get("/forums/:forumID/posts/:postID", getForumPostById);
router.delete("/forums/:forumID/posts/:postID", deleteForumPost);

router.post("/posts/:postID/comments", createPostComments);
router.get("/posts/:postID/comments", getPostComments);
router.get("/posts/:postID/comments/:commentID", getPostCommentById);
router.delete("/posts/:postID/comments/:commentID", deletePostComments);

module.exports = router;