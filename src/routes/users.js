const router = require("express").Router();
const userCtl = require("../controllers/userController");
const { verify } = require("../utils/verifyToken");

router.put("/:id", verify, userCtl.updateUser);
router.delete("/:id", verify, userCtl.deleteUser);
router.get("/find/:id", verify, userCtl.getUser);
router.put("/read/:articleId", verify, userCtl.addToReadList);
router.put("/remove/:article", verify, userCtl.removeFromReadList);

module.exports = router;
