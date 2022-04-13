const createApp = require("./app");
const http = require("http");
const logger = require("./configs/winston");
var SDC = require("statsd-client");
const sdc = new SDC({ host: "localhost", port: 8125 });
const db = require("./configs/db");
const awsConfig = require("./configs/config").AWS_CONFIG;
const s3Provider = require("./utils/s3provider");
const dynamoDbProvider = require("./utils/dynamoDbProvider");
const awsSnsProvider = require("./utils/snsProvider");

const validatePort = (value) => {
  const port = parseInt(value, 10);
  if (isNaN(port)) {
    console.log("Invalid Port");
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Server is listening at port: " + addr.port);
};

const handleShutdown = (signal) => {
  console.log("got %s, starting shutdown", signal);
  if (!server.listening) {
    process.exit(0);
  }
  db.disconnect().then(() => {
    server.close((err) => {
      if (err) {
        console.error(err);
        return process.exit(1);
      }
      console.log("exiting the server");
      process.exit(0);
    });
  });
};

logger.info("Creating s3 provider");
const s3 = new s3Provider(awsConfig.AWS_BUCKET_NAME);
logger.info("Creating dynamoDb provider");
const dynamoDb = new dynamoDbProvider(
  awsConfig.AWS_REGION,
  awsConfig.DYNAMO_DB_TABLE_NAME
);

logger.info("Creating AWS SNS provider");
const sns = new awsSnsProvider(
  awsConfig.SNS_TOPIC_ARN,
  awsConfig.AWS_REGION,
  logger
);

const port = validatePort(process.env.PORT || "3000");
logger.info("Creating express app via createApp");
const app = createApp(db, s3, logger, sdc, dynamoDb, sns);
app.set("port", port);

const server = http.createServer(app);

db.connect().then(() => {
  logger.info("Connected to database");
  logger.info("Starting server at port: " + port);
  server.listen(port);
  server.on("listening", onListening);
});

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);
process.on("SIGHUP", handleShutdown);
