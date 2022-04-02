const winston = require("winston");
const WinstonAwsCloudwatch = require("winston-aws-cloudwatch");
const CloudWatchTransport = WinstonAwsCloudwatch.CloudWatchTransport;

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
    new CloudWatchTransport({
      logGroupName: "csye6225",
      logStreamName: "webservice",
      createLogGroup: true,
      createLogStream: true,
      submissionInterval: 200,
      submissionRetryCount: 1,
      batchSize: 5,
      formatLog: (item) =>
        `${item.level}: ${item.message} ${JSON.stringify(item.meta)}`,
    }),
    new winston.transports.Console(options.console),
  ],
});

logger.level = "silly";

logger.stream({
  write: function (message, encoding) {
    logger.info(message);
  },
});

module.exports = logger;
