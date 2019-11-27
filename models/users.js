const getDB = require('../database/database').getDB;
const mongodb = require('mongodb').ObjectId;

class User {
	constructor(name, email) {
		this.name = name;
		this.email = email;
	}

	save() {
		const db = getDB();
		return db.collection('user').insertOne(this)
	}

	static findById(userId) {
		const db = getDB();
		return db.collection('user').find({_id : new mongodb.ObjectId(userId)}).next()
	}
}

module.exports = User;