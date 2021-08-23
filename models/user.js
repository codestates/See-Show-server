'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.review, {
        foreignKey: 'userId',
        sourceKey : 'id',
      });
    }
  };
  User.init({
    nickname: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    genre: DataTypes.STRING,
    area: DataTypes.STRING,
    firstcheck: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true ,
  });
  return User;
};