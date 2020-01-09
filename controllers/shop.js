const Products = require("../models/products");

exports.getAllProduct = (req, res, next) => {
	Products.fetchAll()
		.then(([rows, feildData]) => {
			res.render('shop/products-list', {
				products: rows,
				path: "/products",
				title_page: "All products"
			})
		})
		.catch(error => {
			console.error("Error in controller/shop getAllProduct", error);
		});
};

exports.getIndex = (req, res, next) => {
	Products.find().then(product => {
		res.render('shop/index', {
			products: product,
			path: '/',
			title_page: "Home Page"
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
			console.log(user.cart[0].productId)
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

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
      path: '/checkout',
      title_page: 'Checkout'
  })
}

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
	req.user.getOrders()
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
	req.user.addOrders()
		.then(() => {
			res.redirect('/order');
		})
		.catch(err => {
			console.error(err);
		});
}