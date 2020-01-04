const getDB = require('../database/database').getDB;
const mongodb = require('mongodb').ObjectId;

class User {
	constructor(name, email, cart, id) {
		this.name = name;
		this.email = email;
		this.cart = cart;
		this.id = id
	}

	save() {
		const db = getDB();
		return db.collection('user').insertOne(this)
	}

	addToCart(product) {
		const updatedCart = {items: [{...product, quantity: 1}]};
		const db = getDB();
		return db.collection('users').updateOne(
			{_id : new ObjectId(this._id)},
			{$set: {cart: updatedCart}}
		);
	}

	static findById(userId) {
		const db = getDB();
		return db.collection('user').find({_id : new mongodb.ObjectId(userId)}).next()
	}
}

module.exports = User;