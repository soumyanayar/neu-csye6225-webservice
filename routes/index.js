const express = require("express");
const router = express.Router();
const logger = require("../configs/winston");

router.get("", async (req, res) => {
  try {
    logger.info("GET /healthz - OK");
    logger.silly(`req.sourceIp: ${req.sourceIp}`);
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
