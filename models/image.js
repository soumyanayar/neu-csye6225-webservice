module.exports = (sequelize, Sequelize) => {
  const Image = sequelize.define("image", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
      validate: {
        isUUID: 4,
      },
    },

    user_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
        isUUID: 4,
      },
    },

    file_name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },

    url: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },

    upload_date: {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
        isDate: true,
      },
    },
  });

  return Image;
};
