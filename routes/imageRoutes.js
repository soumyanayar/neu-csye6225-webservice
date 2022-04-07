module.exports = (db, s3, logger, sdc) => {
  const express = require("express");
  const imageRouter = express.Router();
  const uuid = require("uuid");
  const User = db.models.User;
  const Image = db.models.Image;
  const authorizeToken = require("../middlewares/auth")(User, logger);
  const fs = require("fs");
  const util = require("util");
  const unlinkFile = util.promisify(fs.unlink);
  const multer = require("multer");
  const upload = multer({ dest: __dirname + "/uploads/" });

  imageRouter.post(
    "",
    authorizeToken,
    upload.single("profilePic"),
    async (req, res) => {
      sdc.increment("profilepic.post");
      logger.info("POST /v1/user/self/pic");

      const file = req.file;

      // validate file type
      logger.info("Validating file type");
      if (!file.mimetype.startsWith("image/")) {
        logger.info("Invalid file type");
        return res.status(400).json({
          error: "The file type is not supported",
        });
      }

      logger.info("Uploading file to S3");
      const result = await s3.uploadFile(file);

      // Read existing image for the user
      logger.info("Reading existing image for the user");
      const currentImage = await Image.findOne({
        where: {
          user_id: req.user.id,
        },
      });

      // Delete the old image from s3 and db
      logger.info("Deleting old image from s3 and db");
      if (currentImage) {
        const fileName = currentImage.url.split("/").pop();
        await s3.deleteFile(fileName);
        await currentImage.destroy();
      }

      logger.info("Creating new image for the user");
      const image = Image.build({
        id: uuid.v4(),
        url: result.Location,
        user_id: req.user.id,
        file_name: file.originalname,
        upload_date: new Date(),
      });

      try {
        logger.info("Storing new image for the user in db");
        let result = await image.save();
        // Deleting the file from the uploads folder
        logger.info("Deleting file from uploads folder");
        await unlinkFile(file.path);
        return res.status(201).json(result);
      } catch (err) {
        logger.error(err);
        return res.status(500).json({
          message: "There was an error uploading the image",
        });
      }
    }
  );

  imageRouter.get("", authorizeToken, async (req, res) => {
    try {
      sdc.increment("profilepic.get");
      logger.info("GET /v1/user/self/pic");
      logger.info("Reading image for the user " + req.user.username);
      const image = await Image.findOne({
        where: {
          user_id: req.user.id,
        },
      });

      if (!image) {
        logger.info("No image found for the user " + req.user.username);
        return res.status(404).json({
          message: "No profile picture found for this user",
        });
      }

      // Check if image exists in s3
      logger.info("Checking if image exists in s3");
      const fileName = image.url.split("/").pop();
      const exists = await s3.fileExists(fileName);
      if (!exists) {
        logger.info("Image does not exist in s3");
        return res.status(404).json({
          message: "No profile picture found for this user",
        });
      }

      logger.info("Image found in s3");
      res.status(200).json(image);
    } catch (err) {
      logger.error(err);
      res.status(500).json({
        message: "There was an error getting the image",
      });
    }
  });

  imageRouter.delete("", authorizeToken, async (req, res) => {
    try {
      sdc.increment("profilepic.delete");
      logger.info("DELETE /v1/user/self/pic");
      logger.info("Reading image for the user " + req.user.username);
      const image = await Image.findOne({
        where: {
          user_id: req.user.id,
        },
      });

      if (!image) {
        logger.info("No image found for the user " + req.user.username);
        return res.status(404).json({
          message: "No profile picture found for this user",
        });
      }

      // Deleting the file from the s3 bucket
      const fileName = image.url.split("/").pop();
      console.log("Delete file: ", fileName);
      logger.info("Deleting file from s3");
      await s3.deleteFile(fileName);
      logger.info("Deleting image from db");
      await image.destroy();

      return res.status(204).end();
    } catch (err) {
      logger.error(err);
      res.status(500).json({
        message: "There was an error deleting the image",
      });
    }
  });

  return imageRouter;
};
