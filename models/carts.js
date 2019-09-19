const Sequelize = require('sequelize');
const database = require('../database/database');

const Cart = database.define('cart', {
	id: {
		autoIncrement: true,
		primaryKey: true,
		type: Sequelize.INTEGER,
		allowNull: true
	},

});

module.exports = Cart;