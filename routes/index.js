module.exports = (logger, sdc) => {
  const express = require("express");
  const router = express.Router();

  router.get("", async (req, res) => {
    try {
      sdc.increment("healthz.get");
      logger.info("GET /healthz - OK");
      res.status(200).send();
    } catch (e) {
      res.status(500).send();
    }
  });
  return router;
};
