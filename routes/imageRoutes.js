module.exports = (db, s3) => {
  const express = require("express");
  const imageRouter = express.Router();
  const uuid = require("uuid");
  const User = db.models.User;
  const Image = db.models.Image;
  const authorizeToken = require("../middlewares/auth")(User);
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
      const file = req.file;

      // validate file type
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          error: "The file type is not supported",
        });
      }

      const result = await s3.uploadFile(file);

      // Read existing image for the user
      const currentImage = await Image.findOne({
        where: {
          user_id: req.user.id,
        },
      });

      // Delete the old image from s3 and db
      if (currentImage) {
        const fileName = currentImage.url.split("/").pop();
        await s3.deleteFile(fileName);
        await currentImage.destroy();
      }

      const image = Image.build({
        id: req.user.id,
        url: result.Location,
        user_id: req.user.id,
        file_name: file.originalname,
        upload_date: new Date(),
      });

      try {
        let result = await image.save();
        // Deleting the file from the uploads folder
        await unlinkFile(file.path);
        return res.status(201).json(result);
      } catch (err) {
        return res.status(500).json({
          message: "There was an error uploading the image",
        });
      }
    }
  );

  imageRouter.get("", authorizeToken, async (req, res) => {
    try {
      const image = await Image.findOne({
        where: {
          id: req.user.id,
        },
      });

      if (!image) {
        return res.status(404).json({
          message: "No profile picture found for this user",
        });
      }

      // Check if image exists in s3
      const fileName = image.url.split("/").pop();
      const exists = await s3.fileExists(fileName);
      if (!exists) {
        return res.status(404).json({
          message: "No profile picture found for this user",
        });
      }

      res.status(200).json(image);
    } catch (err) {
      res.status(500).json({
        message: "There was an error getting the image",
      });
    }
  });

  imageRouter.delete("", authorizeToken, async (req, res) => {
    try {
      const image = await Image.findOne({
        where: {
          id: req.user.id,
        },
      });

      if (!image) {
        return res.status(404).json({
          message: "No profile picture found for this user",
        });
      }

      // Deleting the file from the s3 bucket
      const fileName = image.url.split("/").pop();
      console.log("Delete file: ", fileName);
      await s3.deleteFile(fileName);
      await image.destroy();

      return res.status(204).end();
    } catch (err) {
      res.status(500).json({
        message: "There was an error deleting the image",
      });
    }
  });

  return imageRouter;
};
