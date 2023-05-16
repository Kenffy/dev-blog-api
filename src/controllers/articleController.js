const slugify = require("slugify");
const Article = require("../models/Article");
const { createError } = require("../utils/error");

const createArticle = async (req, res, next) => {
  const newArticle = new Article({ ...req.body, userId: req.user.id });
  try {
    const article = await newArticle.save();
    res.status(200).json(article);
  } catch (err) {
    next(err);
  }
};

const updateArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return next(createError(404, "Article not found!"));
    if (req.user.id === article.userId || req.user.isAdmin) {
      const toUpdate = {
        ...req.body,
        slug: slugify(req.body.title, { lower: true, strict: true }),
      };
      const updatedArticle = await Article.findByIdAndUpdate(
        req.params.id,
        {
          $set: toUpdate,
        },
        { new: true }
      );
      res.status(200).json(updatedArticle);
    } else {
      return next(createError(403, "You can update only your article!"));
    }
  } catch (err) {
    next(err);
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    console.log("deleted article.");
    const article = await Article.findById(req.params.id);
    if (!article) return next(createError(404, "Article not found!"));
    if (req.user.id === article.userId || req.user.isAdmin) {
      await Article.findByIdAndDelete(req.params.id);
      res.status(200).json("The article has been deleted.");
    } else {
      return next(createError(403, "You can delete only your article!"));
    }
  } catch (err) {
    next(err);
  }
};

const getArticle = async (req, res, next) => {
  try {
    const article = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    );
    //const article = await Article.findOne({ slug: req.params.slug });
    res.status(200).json(article);
  } catch (err) {
    next(err);
  }
};

const getAllArticles = async (req, res, next) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
};

const addArticleView = async (req, res, next) => {
  try {
    await Article.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json("The view has been increased.");
  } catch (err) {
    next(err);
  }
};

const getRandomArticles = async (req, res, next) => {
  try {
    const articles = await Article.aggregate([{ $sample: { size: 10 } }]);
    res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
};

const getMostViewArticles = async (req, res, next) => {
  try {
    const articles = await Article.find().sort({ views: -1 });
    res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
};

const getArticlesByTag = async (req, res, next) => {
  const tags = req.query.tags.split(",");
  try {
    const articles = await Article.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
};

const searchArticles = async (req, res, next) => {
  const query = req.query.q;
  try {
    const articles = await Article.find({
      title: { $regex: query, $options: "i" },
    }).limit(40);
    res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createArticle,
  updateArticle,
  deleteArticle,
  searchArticles,
  getArticle,
  getAllArticles,
  addArticleView,
  getArticlesByTag,
  getRandomArticles,
  getMostViewArticles,
};
