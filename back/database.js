require('dotenv').config();
const { Sequelize } = require('sequelize');
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const sequelize = new Sequelize('organizer', username, password, {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
