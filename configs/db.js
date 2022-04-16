const dbConfig = require("./config").MYSQL_CONFIG;
const fs = require("fs");
const Sequelize = require("sequelize");

const ca_file = fs.readFileSync("/home/ec2-user/global-bundle.pem");

const sequelize = new Sequelize(
  dbConfig.DB_NAME,
  dbConfig.DB_USERNAME,
  dbConfig.DB_PASSWORD,
  {
    host: dbConfig.DB_HOST,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
        ca: ca_file,
      },
      operatorsAliases: 0,

      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      define: {
        scopes: {
          excludeCreatedAtUpdateAt: {
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        },
        timestamps: false,
      },
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.models = {};
db.models.User = require("../models/user")(sequelize, Sequelize);
db.models.Image = require("../models/image")(sequelize, Sequelize);

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
