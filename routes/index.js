const express = require("express");
const router = express.Router();
const logger = require("../configs/winston");
var SDC = require("statsd-client");
const sdc = new SDC({ host: "localhost", port: 8125 });

router.get("", async (req, res) => {
  try {
    sdc.increment("healthz.get");
    logger.info("GET /healthz - OK");
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
