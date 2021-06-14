'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class show extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        this.hasMany(models.review, {
        foreignKey: 'show_id',
        as: 'review'
      });
    }
  };
  show.init({
    seq: DataTypes.INTEGER,
    title: DataTypes.STRING,
    startDate: DataTypes.STRING,
    endDate: DataTypes.STRING,
    place: DataTypes.STRING,
    realmName: DataTypes.STRING,
    area: DataTypes.STRING,
    thumnail: DataTypes.STRING,
    gpsX: DataTypes.STRING,
    gpsY: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'show',
  });
  return show;
};