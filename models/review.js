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
        foreignkey : 'user_id',
        targetKey : 'id',
      });
      this.belongsTo(models.github, {
        foreignkey : 'github_id',
        targetKey : 'id',
      });
      this.belongsTo(models.show, {
        foreignkey : 'show_id',
        targetKey : 'id',
      });
      
    }
  };
  review.init({
    show_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    github_id: DataTypes.INTEGER,
    point: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'review',
  });
  return review;
};