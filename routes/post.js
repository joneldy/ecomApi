const express = require("express");
const {
  createPost,
  postById,
  postsByUser,
  singlePost,
  isPoster,
  updatePost,
  deletePost,
  comment,
  uncomment,
  updateComment,
} = require("../controllers/post");
const multer = require("multer");
const { requireSignin } = require("../controllers/auth");
const { hasAuthorization } = require("../controllers/user");
const { userById } = require("../controllers/user");
const { createPostValidator } = require("../validator");
const { runValidation } = require("../helpers");
const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// post routes
router.post(
  "/post/new/:userId",
  requireSignin,
  hasAuthorization,
  upload.single("photo"),
  createPostValidator,
  runValidation,
  createPost
);

// comments
router.put("/post/comment", requireSignin, comment);
router.put("/post/uncomment", requireSignin, uncomment);
router.put("/post/updatecomment", requireSignin, updateComment);

router.get("/posts/by/:userId", requireSignin, postsByUser);
router.get("/post/:postId", singlePost);
router.put(
  "/post/:postId",
  requireSignin,
  isPoster,
  upload.single("photo"),
  updatePost
);
router.delete("/post/:postId", requireSignin, isPoster, deletePost);

// any route containing :userId, our app will first execute userByID()
router.param("userId", userById);
// any route containing :postId, our app will first execute postById()
router.param("postId", postById);
module.exports = router;
