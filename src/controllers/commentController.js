const Comment = require("../models/Comment");
const Article = require("../models/Article");
const User = require("../models/User");
const { createError } = require("../utils/error");

const addComment = async (req, res, next) => {
  try {
    const currentArticle = await Article.findById(req.body.articleId);
    if (!currentArticle) return next(createError(404, "Article not found!"));

    const newComment = new Comment({
      ...req.body,
      userId: req.user.id,
    });
    const savedComment = await newComment.save();
    await currentArticle.updateOne({
      $push: { comments: savedComment._id.toString() },
    });

    const result = await User.findById(savedComment.userId);
    const { password, updatedAt, ...user } = result._doc;
    const com = {
      ...savedComment._doc,
      username: user.username,
      profile: user.profile,
    };
    res.status(200).json(com);
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return next(createError(404, "Comment not found!"));
    if (comment.userId === req.user.id) {
      try {
        const article = await Article.findById(comment.articleId);
        if (article.comments.includes(comment._id.toString())) {
          await article.updateOne({
            $pull: { comments: comment._id.toString() },
          });
        }
        await comment.deleteOne();
        res.status(200).json("Comment has been deleted");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your comment");
    }
  } catch (err) {
    next(err);
  }
};

const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ articleId: req.params.articleId });
    if (comments) {
      let results = [];
      for (const comment of comments) {
        const tempUser = await User.findById(
          comment.userId,
          "username profile"
        ).exec();
        const { _id, ...user } = tempUser._doc;
        results.push({ ...comment._doc, ...user });
      }
      res.status(200).json(results);
    } else {
      res.status(200).json("No comment record found!");
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addComment,
  deleteComment,
  getComments,
};
