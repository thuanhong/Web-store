const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const products = new Schema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	imageURL: {
		type: String,
		required: true,
		default: 'https://place-hold.it/300x200'
	}
});

module.exports = mongoose.model('Products', products);