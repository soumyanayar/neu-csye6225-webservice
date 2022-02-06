const express = require("express");
const router = express.Router();

router.get("/healthz", async (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
