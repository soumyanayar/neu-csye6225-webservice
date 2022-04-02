module.exports = (database, s3, logger, sdc) => {
  const express = require("express");
  const path = require("path");
  const morganLogger = require("morgan");
  const basicRoutes = require("./routes")(logger, sdc);
  const userRoutes = require("./routes/userRoutes")(database, logger, sdc);
  const imageRoutes = require("./routes/imageRoutes")(
    database,
    s3,
    logger,
    sdc
  );
  const app = express();

  app.use(morganLogger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/healthz", basicRoutes);
  app.use("/v1/user", userRoutes);
  app.use("/v1/user/self/pic", imageRoutes);
  return app;
};
