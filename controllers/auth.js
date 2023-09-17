const jwt = require("jsonwebtoken");
require("dotenv").config();
const { expressjwt } = require("express-jwt");
const User = require("../models/user");
const _ = require("lodash");

exports.userById = async (req, res, next, id) => {
  try {
    req.profile = await User.findById(id)
      // populate followers and following users array
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec();
    next();
  } catch (error) {
    console.log(error);
  }
};

exports.signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists)
    return res.status(403).json({
      error: "Email is taken!",
    });
  const user = await new User(req.body);
  await user.save();
  res.status(200).json({ message: "Signup success! Please login." });
};

exports.signin = async (req, res) => {
  // find the user based on email

  try {
    const password = req.body.password;
    const userEmail = req.body.email;
    const user = await User.findOne({ email: userEmail }).exec();
    if (!user) {
      return res.status(401).json({
        error: "User with that email does not exist. Please signup.",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match",
      });
    }

    // generate a token with user id and secret
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { algorithm: "HS256" }
    );
    // persist the token as 't' in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    // retrun response with user and token to frontend client
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  } catch (err) {
    console.log(err);
    return res.json({ error: err });
  }
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  return res.json({ message: "Signout success!" });
};

exports.requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});
