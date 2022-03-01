const createApp = require("./app");
const http = require("http");
const db = require("./configs/db");

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

const port = validatePort(process.env.PORT || "3000");
const app = createApp(db);
app.set("port", port);

const server = http.createServer(app);

db.connect().then(() => {
  server.listen(port);
  server.on("listening", onListening);
});

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);
process.on("SIGHUP", handleShutdown);
