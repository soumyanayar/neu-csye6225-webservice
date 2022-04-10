require("dotenv").config();

const {
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
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
    AWS_BUCKET_NAME,
    DYNAMO_DB_TABLE_NAME,
    SNS_TOPIC_ARN,
  },
};
