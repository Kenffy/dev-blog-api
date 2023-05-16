const router = require("express").Router();
const { verify } = require("../utils/verifyToken");
const articleCtl = require("../controllers/articleController");

router.post("/", verify, articleCtl.createArticle);
router.put("/:id", verify, articleCtl.updateArticle);
router.delete("/:id", verify, articleCtl.deleteArticle);
router.get("/", articleCtl.getAllArticles);
router.get("/:slug", articleCtl.getArticle);
router.put("/view/:id", articleCtl.addArticleView);
router.get("/trend", articleCtl.getMostViewArticles);
router.get("/random/:userId", articleCtl.getRandomArticles);
router.get("/tags", articleCtl.getArticlesByTag);
router.get("/search", articleCtl.searchArticles);

module.exports = router;
