const dbConfig = require("./config");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("../models/user")(sequelize, Sequelize);

db.connect = async () => {
  await sequelize.authenticate();
  console.log("Database connected successfully!!");
  await sequelize.sync();
  console.log("Sync done..!!");
};

db.disconnect = async () => {
  await sequelize.close();
  console.log("Database disconnected successfully!");
};

module.exports = db;
