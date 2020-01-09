const mongoose = require('mongoose');

const Schema = mongoose.Schema

const User = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	cart: [
		{
			productId: {type: Schema.Types.ObjectId, ref: 'Products', required: true},
			quantity: {type: Number, required: true},
		}
	],
})

User.methods.addToCart = function(product) {
	const cartItemIndex = this.cart.findIndex(cartItem => {
		return cartItem.productId.toString() === product._id.toString();
	})

	if (cartItemIndex >= 0) {
		this.cart[cartItemIndex].quantity = this.cart[cartItemIndex].quantity + 1
	} else {
		this.cart.push({productId: product._id, quantity: 1})
	}

	return this.save()
}

User.methods.deleteProduct = function(prodId) {
	const updatedCart = this.cart.filter(item => {
		return item.productId._id.toString() !== prodId.toString()
	})

	this.cart = updatedCart;
	return this.save()
}

User.methods.clearCart = function() {
	this.cart = [];
	return this.save()
}

module.exports = mongoose.model('User', User)