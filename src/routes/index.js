const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("server...");
});

module.exports = router;
