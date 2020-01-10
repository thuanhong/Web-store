const Products = require("../models/products");
const Orders = require('../models/orders');

exports.getIndex = (req, res, next) => {
	Products.find().then(product => {
		res.render('shop/index', {
			products: product,
			path: '/',
			title_page: "Home Page",
			isAuthenticated: false
		});
	}).catch(error => {
		console.error(error);
	});
};

exports.getProduct = (req, res, next) => {
	let id = req.params.productID;
	Products.findById(id)
		.then(row => {
			res.render('shop/product-info', {
				products: row,
				path: '/products',
				title_page: row.title,
			});
		})
		.catch(error => {
			console.error(error);
		});
};

exports.getCart = (req, res, next) => {
	req.user.populate('cart.productId').execPopulate()
		.then(user => {
			res.render('shop/cart', {
				path: '/cart',
				title_page: 'Your Cart',
				products : user.cart
			});
		})
		.catch(err => {
			console.error(err)
		});
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Products.findById(prodId)
		.then(product => {
			return req.user.addToCart(product)
		})
		.then(() => {
			res.redirect('/cart')
		})
		.catch(error => {
			console.error(error)
		})
};

exports.postCartDelete = (req, res, next) => {
	const prodId = req.body.productId;
	req.user.deleteProduct(prodId)
		.then(() => {
			res.redirect('/cart');
		})
		.catch(error => {
			console.error("Error : ", error);
		})
}

exports.getUserOrder = (req, res, next) => {
	Orders.find({'user.userId': req.user._id})
		.then(orders => {
			res.render('shop/order', {
				path: '/order',
				title_page: 'Your order',
				orders: orders,
			})
		})
		.catch(error => {
			console.error(error);
		});
}

exports.postUserOrder = (req, res, next) => {
	req.user.populate('cart.productId').execPopulate()
		.then(user => {
			const products = user.cart.map(item => {
				return {quantity : item.quantity, product: {...item.productId._doc}}
			})
			const newOrder = new Orders({
				products: products,
				user: {
					name : user.name,
					userId: user._id
				}
			})
			return newOrder.save()
		})
		.then(() => {
			return req.user.clearCart();
		})
		.then(() => {
			res.redirect('/order');
		})
		.catch(err => {
			console.error(err);
		});
}