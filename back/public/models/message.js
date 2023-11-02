const { DataTypes } = require('sequelize');
const sequelize = require('../../database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  video: {
    type: DataTypes.STRING, // URL or identifier of the video
    allowNull: true,
  },
  audio: {
    type: DataTypes.STRING, // URL or identifier of the audio
    allowNull: true,
  },
  location: {
    type: DataTypes.JSON, // GeoJSON object for location data
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
