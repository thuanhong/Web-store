const getDB = require('../database/database').getDB;

class Product {
	constructor(title, price, description, imageUrl) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageURL = imageUrl;
	}

	save() {
		const db = getDB();
		return db.collection('products').insertOne(this)
			.then(result => {
				console.log(result)
			})
			.catch(err => {
				console.error(err)
			});
	}

	static fetchAll() {
		const db = getDB();
		return db.collection('products').find().toArray()
			.then(products => {
				console.log(products);
				return products;
			})
			.catch(error => {
				console.error(error)
			});
	}
}

module.exports = Product;