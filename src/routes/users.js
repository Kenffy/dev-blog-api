const router = require("express").Router();
const userCtl = require("../controllers/userController");
const { verifyToken } = require("../utils/verifyToken");

router.put("/:id", verifyToken, userCtl.updateUser);
router.delete("/:id", verifyToken, userCtl.deleteUser);
router.get("/find/:id", userCtl.getUser);

module.exports = router;
