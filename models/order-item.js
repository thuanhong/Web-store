const Sequelize = require('sequelize');
const database = require('../database/database');

const OrderItem = database.define('orderItem', {
	id: {
		autoIncrement: true,
		primaryKey: true,
		type: Sequelize.INTEGER,
		allowNull: true
	},
	quantity: Sequelize.INTEGER
});

module.exports = OrderItem;