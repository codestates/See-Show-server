'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignkey : 'userId',
        targetKey : 'id',
      });
      this.belongsTo(models.github, {
        foreignkey : 'githubId',
        targetKey : 'id',
      });
      this.belongsTo(models.show, {
        foreignkey : 'showId',
        targetKey : 'id',
      });
      
    }
  };
  review.init({
    showId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    githubId: DataTypes.INTEGER,
    point: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'review',
  });
  return review;
};