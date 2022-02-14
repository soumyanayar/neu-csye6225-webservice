const bcrypt = require("bcrypt");
const db = require("../configs/db");
const User = db.User;

const getUserPasswordAuth = (authHeader) => {
  let decodedBasicToken = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString("ascii")
    .split(":");
  let username = decodedBasicToken[0];
  let password = decodedBasicToken[1];
  return { username, password };
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const authorizeToken = async (req, res, next) => {
  let authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      message: "Missing authorization header",
    });
  }
  let { username, password } = getUserPasswordAuth(authHeader);
  let user = await User.findOne({
    where: {
      username: username,
    },
  });
  if (!user) {
    return res.status(401).json({
      message: "Unauthorized: Invalid username or password",
    });
  }
  let isPasswordMatch = await comparePassword(password, user.password);
  if (!isPasswordMatch) {
    return res.status(401).json({
      message: "Unauthorized: Invalid username or password",
    });
  }
  req.user = user;
  next();
};

module.exports = authorizeToken;
