const winston = require("winston");
const WinstonAwsCloudwatch = require("winston-aws-cloudwatch");

var options = {
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
    timestamp: true,
  },
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(options.console)({
      timestamp: true,
      colorize: true,
    }),
    new WinstonAwsCloudwatch({
      logGroupName: "csye6225",
      logStreamName: "webservice",
      createLogGroup: true,
      createLogStream: true,
      logRetention: 7,
      json: false,
      submissionInterval: 200,
      submissionRetryCount: 1,
      batchSize: 5,
      awsConfig: {
        region: "us-west-2",
      },
      formatLog: (item) =>
        `${item.timestamp} ${item.level}: ${item.message} ${JSON.stringify(
          item.meta
        )}`,
    }),
  ],
  exitOnError: false,
});

logger.level = "silly";

logger.stream({
  write: function (message, encoding) {
    logger.info(message);
  },
});

module.exports = logger;
