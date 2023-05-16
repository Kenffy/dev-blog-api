const router = require("express").Router();
const authCtl = require("../controllers/authController.js");

router.post("/login", authCtl.login);
router.post("/refresh", authCtl.refresh);
router.post("/register", authCtl.register);
router.post("/logout", authCtl.logout);

module.exports = router;
