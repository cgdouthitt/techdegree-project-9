"use strict";
const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
// const { Sequelize } = require(".");
module.exports = (sequelize) => {
  class User extends Model {}
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A firstName is required",
          },
          notEmpty: {
            msg: "Please provide a firstName",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A lastName is required",
          },
          notEmpty: {
            msg: "Please provide a lastName",
          },
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "The emailAddress you entered already exists",
        },
        validate: {
          isEmail: {
            msg: "Please enter a valid emailAddress",
          },
          notNull: {
            msg: "An emailAddress is required",
          },
          notEmpty: {
            msg: "Please provide an emailAddress",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue("password", hashedPassword);
        },
        validate: {
          notNull: {
            msg: "A password is required",
          },
          notEmpty: {
            msg: "Please provide a password",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: "userId",
    });
  };
  return User;
};
