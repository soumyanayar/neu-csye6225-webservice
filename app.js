module.exports = (database, s3) => {
  const express = require("express");
  const path = require("path");
  const logger = require("morgan");
  const basicRoutes = require("./routes");
  const userRoutes = require("./routes/userRoutes")(database);
  const imageRoutes = require("./routes/imageRoutes")(database, s3);
  const app = express();

  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/healthz", basicRoutes);
  app.use("/v1/user", userRoutes);
  app.use("/v1/user/self/pic", imageRoutes);
  return app;
};
