"use strict";
const { Model, DataTypes } = require("sequelize");
// const { Sequelize } = require(".");
module.exports = (sequelize) => {
  class User extends Model {}
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      emailAddress: DataTypes.STRING,
      password: DataTypes.STRING,
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
