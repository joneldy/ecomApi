const express = require("express");
const { signup, signin, signout } = require("../controllers/auth");
const {
  userSignupValidationRules,
  userSigninValidator,
} = require("../validator");
const { runValidation } = require("../helpers");
const { userById } = require("../controllers/user");

const router = express.Router();

router.post("/signup", userSignupValidationRules, runValidation, signup);
router.post("/signin", userSigninValidator, runValidation, signin);
router.get("/signout", signout);

// any route containing :userId, our app will first execute userByID()
router.param("userId", userById);

module.exports = router;
