module.exports = (User, logger) => {
  const {
    getUserPasswordAuth,
    comparePassword,
  } = require("../utils/authHelpers");

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

  return authorizeToken;
};
