module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
      validate: {
        isUUID: 4,
      },
    },

    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: true,
        notEmpty: true,
        isEmail: true,
      },
    },

    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },

    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },

    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },

    account_created: {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
        isDate: true,
      },
    },

    account_updated: {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
        isDate: true,
      },
    },
  });

  return User;
};
