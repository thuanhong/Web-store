const getDB = require('../database/database').getDB;
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId

class User {
	constructor(name, email, cart, id) {
		this.name = name;
		this.email = email;
		this.cart = cart;
		this._id = id
	}

	save() {
		const db = getDB();
		return db.collection('user').insertOne(this)
	}

	addToCart(product) {
		const db = getDB();

		if (!this.cart) {
			return db.collection('user').updateOne(
				{_id : new ObjectId(this._id)},
				{$set: {cart: [{productId: product._id, quantity: 1}]}}
			);
		}

		const cartItemIndex = this.cart.findIndex(cartItem => {
			return cartItem.productId.toString() === product._id.toString();
		})

		const updatedCartItems = [...this.cart];
		if (cartItemIndex >= 0) {
			updatedCartItems[cartItemIndex].quantity = this.cart[cartItemIndex].quantity + 1
		} else {
			updatedCartItems.push({productId: product._id, quantity: 1})
		}

		
		return db.collection('user').updateOne(
			{_id : new ObjectId(this._id)},
			{$set: {cart: updatedCartItems}}
		);
	}

	getCart() {
		const db = getDB();
		const list_productId = this.cart.map(product => {
			return product.productId;
		})

		return db.collection('products').find
	}

	static findById(userId) {
		const db = getDB();
		return db.collection('user').findOne({_id : new ObjectId(userId)})
			.then(user => {
				return user
			})
			.catch(error => {
				console.error(error)
			})
	}
}

module.exports = User;