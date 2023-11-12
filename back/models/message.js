const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  video: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  audio: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.JSON, 
    allowNull: true,
  },
  file: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
});

module.exports = Message;
