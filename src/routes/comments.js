const { verifyToken } = require("../utils/verifyToken");
const commentCtl = require("../controllers/commentController");
const router = require("express").Router();

router.post("/", verifyToken, commentCtl.addComment);
router.delete("/:id", verifyToken, commentCtl.deleteComment);
router.get("/:videoId", commentCtl.getComments);

module.exports = router;
