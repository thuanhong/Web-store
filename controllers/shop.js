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
			console.log("Error in controller/shop getAllProduct", error);
		});
};

exports.getIndex = (req, res, next) => {
	Products.fetchAll().then(product => {
		res.render('shop/index', {
			products: product,
			path: '/',
			title_page: "Home Page"
		});
	}).catch(error => {
		console.log(error);
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
			console.log(error);
		});
};

exports.getCart = (req, res, next) => {
	req.user.getCart()
		.then(cart => {
			cart.getProducts()
				.then(products => {
					res.render('shop/cart', {
				    path: '/cart',
				    title_page: 'Your Cart',
						products : products
					});
				})
				.catch(err => {console.log(err)});
		})
		.catch(err => {
			console.log(err);
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
		.then(result => {
			console.log(result)
		})
		.catch()

	// let fetchedCart;
	// let newQuantity = 1;
	// req.user.getCart()
	// 	.then(cart => {
	// 		fetchedCart = cart;
	// 		return cart.getProducts({where: {id: prodId}})
	// 	})
	// 	.then(products => {
	// 		let product;
	// 		if (products.length > 0) {
	// 			product = products[0];
	// 		}
	// 		if (product) {
	// 			const oldQuantity = product.cartItem.quantity;
	// 			newQuantity = oldQuantity + 1;
	// 			return product;
	// 		}
	// 		return Products.findByPk(prodId)
	// 	})
	// 	.then(product => {
	// 		return fetchedCart.addProduct(product, {
	// 			through: {quantity: newQuantity}
	// 		})
	// 	})
	// 	.then(() => {
	// 		res.redirect('/cart');
	// 	})
	// 	.catch(err => {
	// 		console.log((err));
	// 	});
};

exports.postCartDelete = (req, res, next) => {
	const prodId = req.body.productId;
	req.user.getCart()
		.then(cart => {
			return cart.getProducts({where : {id: prodId}})
		})
		.then(product => {
			return product[0].cartItem.destroy();
		})
		.then(() => {
			res.redirect('/cart');
		})
		.catch(error => {
			console.log("Error : ", error);
		})
}

exports.getUserOrder = (req, res, next) => {
	req.user.getOrders({include : ['products']})
		.then(orders => {
			res.render('shop/order', {
				path: '/order',
				title_page: 'Your order',
				orders: orders,
			})
		})
		.catch(error => {
			console.log(error);
		});
}

exports.postUserOrder = (req, res, next) => {
	let fetchedCart;
	req.user.getCart()
		.then(cart => {
			fetchedCart = cart;
			return cart.getProducts();
		})
		.then(products => {
			req.user.createOrder()
				.then(order => {
					console.log(order);
					return order.addProducts(products.map(product => {
						product.orderItem = {quantity : product.cartItem.quantity}
						return product;
					}))
				})
				.catch(err => {
					console.log(err);
				});
		})
		.then(result => {
			return fetchedCart.setProducts(null);
		})
		.then(result => {
			res.redirect('/order');
		})
		.catch(err => {
			console.log(err);
		});
}