module.exports = (database, s3, logger, sdc) => {
  const express = require("express");
  const path = require("path");
  const morganLogger = require("morgan");
  logger.info("Loading basic routes");
  const basicRoutes = require("./routes")(logger, sdc);
  logger.info("Loading user routes");
  const userRoutes = require("./routes/userRoutes")(database, logger, sdc);
  logger.info("Loading image routes");
  const imageRoutes = require("./routes/imageRoutes")(
    database,
    s3,
    logger,
    sdc
  );
  logger.info("Creating express app");
  const app = express();

  logger.info("Configuring morgan logger middleware");
  app.use(morganLogger("dev"));
  logger.info("Configuring express.json middleware");
  app.use(express.json());
  logger.info("Configuring express.urlencoded middleware");
  app.use(express.urlencoded({ extended: false }));

  logger.info("Configuring basic routes");
  app.use("/healthz", basicRoutes);
  logger.info("Configuring user routes");
  app.use("/v1/user", userRoutes);
  logger.info("Configuring image routes");
  app.use("/v1/user/self/pic", imageRoutes);
  return app;
};
