module.exports = (database, s3, logger, sdc, dynamoDb, sns) => {
  const express = require("express");
  const path = require("path");
  const morganLogger = require("morgan");
  logger.info("Loading basic routes");
  const basicRoutes = require("./routes")(logger, sdc);
  logger.info("Loading user routes");
  const userRoutes = require("./routes/userRoutes")(
    database,
    logger,
    sdc,
    dynamoDb,
    sns
  );
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
  logger.info("Configuring route for verifying user email");
  app.use("/v1/verifyUserEmail", async (req, res) => {
    logger.info("Verifying user email");
    logger.info("Read Query Parameter email");
    let email = req.query.email;
    logger.info("Read Query Parameter token");
    let token = req.query.token;

    logger.info("Verifying email and token in dynamo db");
    const isValid = await dynamoDb.verifyUserToken(email, token);
    if (isValid) {
      logger.info("Email and token are valid");
      logger.info("Updating user details in MySQL database");
      const user = await database.models.User.findOne({
        where: { email: email },
      });
      user.verified = true;
      user.verified_on = new Date();
      try {
        await user.save();
      } catch (err) {
        logger.error(err);
        return res.status(500).json({
          message: "Internal server error",
        });
      }

      logger.info("Email verified successfully");
      res.status(200).json({
        message: "Email verified successfully",
      });
    }
  });

  return app;
};
