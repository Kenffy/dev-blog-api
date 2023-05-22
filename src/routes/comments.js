const { verify } = require("../utils/verifyToken");
const commentCtl = require("../controllers/commentController");
const router = require("express").Router();

router.post("/", verify, commentCtl.addComment);
router.delete("/:id", verify, commentCtl.deleteComment);
router.get("/:articleId", commentCtl.getComments);

module.exports = router;
