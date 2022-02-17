const bcrypt = require("bcrypt");

const getUserPasswordAuth = (authHeader) => {
  let decodedBasicToken = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString("ascii")
    .split(":");
  let username = decodedBasicToken[0];
  let password = decodedBasicToken[1];
  return { username, password };
};

const hashifyPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  // now set user password to hashed password
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = { getUserPasswordAuth, hashifyPassword, comparePassword };
