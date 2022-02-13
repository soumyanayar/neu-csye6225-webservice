const bcrypt = require("bcrypt");
const express = require("express");
const db = require("../configs/db");
const User = db.User;
const userRouter = express.Router();
const uuid = require("uuid");

const hashifyPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  // now we set user password to hashed password
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const formatUser = (user) => {
  if (user["password"]) {
    delete user["password"];
    return user;
  }
};

// signup route
userRouter.post("/", async (req, res) => {
  const hashedPassword = await hashifyPassword(req.body.password);

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
    let result = await user.save();
    let formattedUser = formatUser(result.dataValues);
    return res.status(201).json(formattedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = userRouter;
