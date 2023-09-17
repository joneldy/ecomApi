const _ = require("lodash");
const User = require("../models/user");

exports.userById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id)
      // populate followers and following users array
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec();
    req.profile = user; // adds profile object in req with user info
    next();
  } catch (error) {
    return res.status(400).json({
      error: "User not found",
    });
  }
};

exports.hasAuthorization = (req, res, next) => {
  let sameUser = req.profile && req.auth && req.profile._id == req.auth._id;
  let adminUser = req.profile && req.auth && req.auth.role === "admin";

  const authorized = sameUser || adminUser;

  // console.log("req.profile ", req.profile, " req.auth ", req.auth);
  // console.log("SAMEUSER", sameUser, "ADMINUSER", adminUser);

  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized to perform this action",
    });
  }
  next();
};

exports.allUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("name email updated created role")
      .exec();
    res.json(users);
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

exports.updateUser = async (req, res, next) => {
  let user = req.profile;
  user = _.extend(user, req.body); // extend - mutate the source object
  user.photo = {
    data: req.file.buffer,
    contentType: req.file.mimetype,
  };
  user.updated = Date.now();

  try {
    await user.save();
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json({ user });
  } catch (error) {
    return res.status(400).json({
      error: "You are not authorized to perform this action",
    });
  }
};

exports.userPhoto = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set(("Content-Type", req.profile.photo.contentType));
    return res.send(req.profile.photo.data);
  }
  next();
};

exports.deleteUser = async (req, res, next) => {
  let user = req.profile;
  try {
    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("error ", error);
    return res.status(400).json({
      error: error,
    });
  }
};

exports.getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.hasAuthorization = (req, res, next) => {
  let sameUser = req.profile && req.auth && req.profile._id == req.auth._id;
  let adminUser = req.profile && req.auth && req.auth.role === "admin";

  const authorized = sameUser || adminUser;

  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized to perform this action",
    });
  }
  next();
};
