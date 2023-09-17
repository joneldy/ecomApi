const express = require("express");
const { requireSignin } = require("../controllers/auth");
const multer = require("multer");

const {
  updateUser,
  deleteUser,
  userById,
  hasAuthorization,
} = require("../controllers/user");

const { allUsers, getUser } = require("../controllers/user");
// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/users", allUsers);
router.get("/user/:userId", requireSignin, getUser);
router.put(
  "/user/:userId",
  requireSignin,
  hasAuthorization,
  upload.single("photo"),
  updateUser
);
router.delete("/user/:userId", requireSignin, hasAuthorization, deleteUser);

// any route containing :userId, our app will first execute userByID()
router.param("userId", userById);

module.exports = router;
