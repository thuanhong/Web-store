const Sequelize = require('sequelize');
const database = require('../database/database');

const Order = database.define('order', {
	id: {
		autoIncrement: true,
		primaryKey: true,
		type: Sequelize.INTEGER,
		allowNull: true
	},
});

module.exports = Order;