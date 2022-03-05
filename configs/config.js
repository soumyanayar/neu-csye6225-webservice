require("dotenv").config();

const {
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  AWS_REGION,
  AWS_BUCKET_NAME,
} = process.env;
module.exports = {
  PORT,
  MYSQL_CONFIG: {
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
  },
  AWS_CONFIG: {
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,
    AWS_REGION,
    AWS_BUCKET_NAME,
  },
};
