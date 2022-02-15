module.exports = (db) => {
  const express = require("express");
  const userRouter = express.Router();
  const uuid = require("uuid");
  const User = db.models.User;
  const authorizeToken = require("../middlewares/auth")(User);
  const { hashifyPassword } = require("../utils/authHelpers");

  // remove the password from the user object
  const formatUser = (user) => {
    if (user["password"]) {
      delete user["password"];
      return user;
    }
  };

  // POST /v1/user : create a new user and store in the db
  userRouter.post("/", async (req, res) => {
    // validation for the user object id, account_created, account_updated fields should not be sent in the request body
    if (req.body.id || req.body.account_created || req.body.account_updated) {
      return res.status(400).json({
        message: "id, account_created, and account_updated cannot be set",
      });
    }
    // validation for the user object, username, password, first_name, last_name can't be empty
    if (
      !req.body.username ||
      !req.body.password ||
      !req.body.first_name ||
      !req.body.last_name
    ) {
      return res.status(400).json({
        message: "username, password, first_name, and last_name are required",
      });
    }

    const hashedPassword = await hashifyPassword(req.body.password);
    // create a new user
    const user = User.build({
      id: uuid.v4(),
      username: req.body.username,
      password: hashedPassword,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      account_created: new Date(),
      account_updated: new Date(),
    });

    try {
      // store the user in the db and return the user
      let result = await user.save();
      let formattedUser = formatUser(result.dataValues);
      return res.status(201).json(formattedUser);
    } catch (err) {
      // If username already exists, return a 400 error
      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ message: "Username already exists" });
      } else if (err.name === "SequelizeValidationError") {
        return res.status(400).json({
          message:
            "Invalid username, Username should be an email Ex: abc@domain.com",
        });
      } else {
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  userRouter.get("/self", authorizeToken, async (req, res) => {
    try {
      let formattedUser = formatUser(req.user.dataValues);
      return res.status(200).json(formattedUser);
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  userRouter.put("/self", authorizeToken, async (req, res) => {
    let user = req.user;
    if (
      req.body.id ||
      req.body.username ||
      req.body.account_updated ||
      req.body.account_created
    ) {
      return res.status(400).json({
        message:
          "id, username, account_created, and account_updated cannot be set",
      });
    }

    if (!(req.body.password || req.body.first_name || req.body.last_name)) {
      return res.status(400).json({
        message: "password, first_name, or last_name are required",
      });
    }

    user.set({
      first_name: req.body.first_name || user.first_name,
      last_name: req.body.last_name || user.last_name,
      password: req.body.password
        ? await hashifyPassword(req.body.password)
        : user.password,
      account_updated: new Date(),
    });

    try {
      await user.save();
      res.status(204).send();
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  return userRouter;
};
