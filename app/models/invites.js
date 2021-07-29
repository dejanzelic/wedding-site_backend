'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Invite.init({
    code: DataTypes.STRING,
    confirmed: DataTypes.BOOLEAN,
    email: DataTypes.STRING,
    language: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Invite',
  });
  return Invite;
};