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
	imageUrl: {
		type: String,
		required: true,
		default: 'https://place-hold.it/300x200'
	}
});

module.exports = mongoose.model('Products', products);

// const getDB = require('../database/database').getDB;
// const mongodb = require('mongodb');

// class Product {
// 	constructor(title, price, description, imageUrl, id, userId) {
// 		this.title = title;
// 		this.price = price;
// 		this.description = description;
// 		this.imageURL = imageUrl;
// 		this._id = id ? mongodb.ObjectId(id) : null;
// 		this.userId = userId
// 	}

// 	save() {
// 		const db = getDB();
// 		let output;

// 		if (this._id) {
// 			output = db.collection('products').updateOne({_id : new mongodb.ObjectId(this._id)}, {$set : this})
// 		} else {
// 			output = db.collection('products').insertOne(this)
// 		}

// 		return output
// 			.then(result => {
// 				console.log(result)
// 			})
			
// 			.catch(err => {
// 				console.error(err)
// 			});
// 	}

// 	static fetchAll() {
// 		const db = getDB();
// 		return db.collection('products').find().toArray()
// 			.then(products => {
// 				return products;
// 			})
// 			.catch(error => {
// 				console.error(error)
// 			});
// 	}

// 	static findById(prodId) {
// 		const db = getDB();
// 		return db.collection('products').find({_id : mongodb.ObjectId(prodId)}).next()
// 			.then(product => {
// 				return product;
// 			})
// 			.catch(error => {
// 				console.error(error)
// 			});
// 	}

// 	static deleteById(prodId) {
// 		const db = getDB();
// 		return db.collection('products').deleteOne({_id : new mongodb.ObjectId(prodId)})
// 	}
//  }

// module.exports = Product;