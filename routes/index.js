const express = require("express");
const router = express.Router();

router.get("", async (req, res) => {
  try {
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
