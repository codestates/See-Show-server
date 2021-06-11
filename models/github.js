'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class github extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  github.init({
    login: DataTypes.STRING,
    name: DataTypes.STRING,
    genre: DataTypes.STRING,
    area: DataTypes.STRING,
    firstcheck: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'github',
  });
  return github;
};