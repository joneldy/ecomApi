const Post = require("../models/post");
const _ = require("lodash");

exports.postById = async (req, res, next, id) => {
  try {
    const post = await Post.findById(id)
      .populate("postedBy", "_id name")
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name role")
      .select("_id title body created likes comments photo")
      .exec();
    req.post = post;
    next();
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

exports.deletePost = async (req, res) => {
  let post = req.post;

  try {
    await post.deleteOne();
    res.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log("error ==>", error);
    return res.status(400).json({
      error: error,
    });
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    let post = req.post;
    post = _.extend(post, req.body);
    post.updated = Date.now();

    if (req?.file?.mimetype) {
      post.photo = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }
    await post.save();
    res.json(post);
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

exports.isPoster = (req, res, next) => {
  let sameUser = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  let adminUser = req.post && req.auth && req.auth.role === "admin";

  let isPoster = sameUser || adminUser;

  if (!isPoster) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }
  next();
};

exports.createPost = async (req, res, next) => {
  let post = new Post(req.body);
  req.profile.hashed_password = null;
  req.profile.salt = null;
  post.postedBy = req.profile;
  if (req?.file?.mimetype) {
    post.photo = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };
  }

  try {
    const result = await post.save();
    res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: error,
    });
  }
};

exports.singlePost = (req, res) => {
  return res.json(req.post);
};

exports.postsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.profile._id })
      .populate("postedBy", "_id name")
      .select("_id title body created likes")
      .sort("_created")
      .exec();

    res.json(posts);
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

exports.comment = async (req, res) => {
  let comment = req.body.comment;
  comment.postedBy = req.body.userId;

  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

exports.uncomment = async (req, res) => {
  let comment = req.body.comment;

  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { comments: { _id: comment._id } } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    return res.json(result);
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({
      error: error,
    });
  }
};

exports.updateComment = async (req, res) => {
  let comment = req.body.comment;

  try {
    const result = await Post.findOneAndUpdate(
      { _id: req.body.postId, "comments._id": comment._id },
      { $set: { updated: new Date(), "comments.$.text": comment.text } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(result);
  } catch (error) {
    throw new Error(error.message);
  }
};
