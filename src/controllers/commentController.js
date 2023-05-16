const Comment = require("../models/Comment");
const Article = require("../models/Article");
const { createError } = require("../utils/error");

const addComment = async (req, res, next) => {
  const newComment = new Comment({ ...req.body, userId: req.user.id });
  try {
    const savedComment = await newComment.save();
    res.status(200).send(savedComment);
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(res.params.id);
    const article = await Article.findById(res.params.id);
    if (req.user.id === comment.userId || req.user.id === article.userId) {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json("The comment has been deleted.");
    } else {
      return next(createError(403, "You can delete ony your comment!"));
    }
  } catch (err) {
    next(err);
  }
};

const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ articleId: req.params.articleId });
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addComment,
  deleteComment,
  getComments,
};
