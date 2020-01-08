const mongoose = require('mongoose');

const Schema = mongoose.Schema

const User = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	cart: {
		type: [{
			productId: Schema.Types.ObjectId,
			quantity: Number,
		}],
		required: true
	}
})

module.exports = mongoose.model('User', User)