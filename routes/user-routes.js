const bcrypt = require("bcrypt");
const express = require("express");
const db = require("../configs/db");
const User = db.User;
const userRouter = express.Router();
const uuid = require("uuid");
const user = require("../models/user");
const authorizeToken = require("../middleware/Auth");

const hashifyPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  // now set user password to hashed password
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// remove the password from the user object
const formatUser = (user) => {
  if (user["password"]) {
    delete user["password"];
    return user;
  }
};

// POST /v1/user : create a new user and store in the db
userRouter.post("/", async (req, res) => {
  const hashedPassword = await hashifyPassword(req.body.password);
  //create a new user
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
    //store the user in the db and return the user
    let result = await user.save();
    let formattedUser = formatUser(result.dataValues);
    return res.status(201).json(formattedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

userRouter.get("/self", authorizeToken, async (req, res) => {
  try {
    let formattedUser = formatUser(req.user.dataValues);
    return res.status(200).json(formattedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

userRouter.put("/self", authorizeToken, async (req, res) => {
  let user = req.user;

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
    res.status(500).send(err);
  }
});

module.exports = userRouter;
