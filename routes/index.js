const express = require("express");
const router = express.Router();

router.get("/healthz", async (req, res) => {
  try {
    res.status(200).json({ message: "Ok" });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
