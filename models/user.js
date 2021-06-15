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
        foreignKey: 'user_id',
        sourceKey : 'id',
      });
    }
  };
  User.init({
    userId: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    genre: DataTypes.STRING,
    area: DataTypes.INTEGER,
    firstcheck: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true ,
  });
  return User;
};