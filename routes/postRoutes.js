const { Router } = require("express");
const formidable = require("express-formidable");
const { protect } = require("../middlewares/auth");
const { createPost, editPost, deletePost, getMyPosts, getSinglePost, getUserPosts, getHomePageFriendsPosts, likePost, unlikePost, commentOnPost, deletePostComment, likePostComment, unlikePostComment } = require("../controllers/postController");

const router = Router();

router.use(protect);

router.post("/comment/like", likePostComment);
router.post("/comment/unlike", unlikePostComment);

router.get("/user/:userId", getUserPosts);

router.delete("/comment/:postId/:commentId", deletePostComment);
router.route("/comment")
  .post(formidable(), commentOnPost);

router.post("/like", likePost);
router.post("/unlike", unlikePost);
router.get("/myPosts", getMyPosts);
router.get("/homePosts", getHomePageFriendsPosts);

router.route("/:postId")
  .get(getSinglePost)
  .delete(deletePost);

router.route("/")
  .post(formidable(), createPost)
  .put(formidable(), editPost);

module.exports = router;