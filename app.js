module.exports = (database) => {
  const express = require("express");
  const path = require("path");
  const logger = require("morgan");
  const basicRoutes = require("./routes");
  const userRoutes = require("./routes/userRoutes")(database);
  const app = express();

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/healthz", basicRoutes);
  app.use("/v1/user", userRoutes);
  return app;
};
