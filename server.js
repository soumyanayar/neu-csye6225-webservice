let app = require("./app");
let http = require("http");

const validatePort = (value) => {
  let port = parseInt(value, 10);
  if (isNaN(port)) {
    console.log("Invalid Port");
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

let port = validatePort(process.env.PORT || "3000");
app.set("port", port);
let server = http.createServer(app);
server.listen(port);
