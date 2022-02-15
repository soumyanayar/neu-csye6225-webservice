require("dotenv").config();

const { PORT, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } =
  process.env;

module.exports = {
  PORT,
  MYSQL_CONFIG: {
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
  },
};
