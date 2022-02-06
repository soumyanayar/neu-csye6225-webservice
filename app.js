const express = require("express");
const path = require("path");
const logger = require("morgan");
const routes = require("./routes");
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

/* GET home page. */
app.get("/", (req, res) => {
  console.log("Root route");
  res.render("index", { title: "Express" });
});

/* All the routes */
app.use("/spring2022-csye6225/app/1.0.0/", routes);

module.exports = app;
