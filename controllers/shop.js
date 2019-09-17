const Products = require("../models/products");

exports.getAllProduct = (req, res, next) => {
	Products.FetchAll()
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
	Products.findAll().then(product => {
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
	Products.findByPk(id)
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
  res.render('shop/cart', {
      path: '/cart',
      title_page: 'Your Cart'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
      path: '/checkout',
      title_page: 'Checkout'
  })
};