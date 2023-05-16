const router = require("express").Router();
const { verifyToken, verify } = require("../utils/verifyToken");
const articleCtl = require("../controllers/articleController");

router.post("/", verify, articleCtl.createArticle);
router.put("/:id", verify, articleCtl.updateArticle);
router.delete("/:id", verify, articleCtl.deleteArticle);
router.get("/", articleCtl.getAllArticles);
router.get("/:slug", articleCtl.getArticle);
router.put("/view/:id", articleCtl.addArticleView);
router.get("/trend", articleCtl.getMostViewArticles);
router.get("/random", articleCtl.getRandomArticles);
router.get("/tags", articleCtl.getArticlesByTag);
router.get("/search", articleCtl.searchArticles);

module.exports = router;
