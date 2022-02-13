const express = require("express");
const path = require("path");
const logger = require("morgan");
const routes = require("./routes/index");
const userRouter = require("./routes/user-routes");
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* All the routes */
app.use("/spring2022-csye6225/app/1.0.0/", routes);
app.use("/spring2022-csye6225/app/a02/v1/user", userRouter);

module.exports = app;
