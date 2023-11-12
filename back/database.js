require('dotenv').config();

console.log('DB Username:', process.env.DB_USERNAME);
console.log('DB Password:', process.env.DB_PASSWORD);
console.log('DB Name:', process.env.DB_NAME);
console.log('DB Host:', process.env.DB_HOST);
const { Sequelize } = require('sequelize');

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;
const host = process.env.DB_HOST;

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: 'mysql',
});

module.exports = sequelize;
