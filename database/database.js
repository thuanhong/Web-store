const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.MYSQL_ADDON_DB, process.env.MYSQL_ADDON_USER, process.env.MYSQL_ADDON_PASSWORD, {
	dialect: 'mysql',
	host: process.env.MYSQL_ADDON_HOST,
	port: process.env.MYSQL_ADDON_PORT
});

module.exports = sequelize;