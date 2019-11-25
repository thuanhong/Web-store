const Sequelize = require('sequelize');
const database = require('../database/database');

const CartItem = database.define('cartItem', {
	id: {
		autoIncrement: true,
		primaryKey: true,
		type: Sequelize.INTEGER,
		allowNull: true
	},
	quantity: Sequelize.INTEGER
});

module.exports = CartItem;