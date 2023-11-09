const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  online: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  avatarURL: {
    type: DataTypes.STRING,
  },
});

module.exports = User;
