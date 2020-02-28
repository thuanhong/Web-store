const Products = require("../models/products");
const Orders = require('../models/orders');
const PDFDoc = require('pdfkit');

const ITEM_PER_PAGE = 2

const stripe = require('stripe')('sk_test_XCBLPdt9IhXbuBmIWMK2103g00wYNyLsvM');

exports.getIndex = (req, res, next) => {
	const page = req.query.page;
	let totalNumber;
	Products.find().countDocuments()
		.then(total => {
			totalNumber = total;
			return Products.find().skip((page-1) * ITEM_PER_PAGE).limit(ITEM_PER_PAGE)
		})
		.then(product => {
			res.render('shop/index', {
				products: product,
				path: '/',
				title_page: "Home Page",
				previous: page > 1 ?  page - 1 : undefined ,
				next: page === undefined ? 2 : page * ITEM_PER_PAGE < totalNumber ? parseInt(page) + 1 : undefined,
				current: page ? page : 1,
				last: Math.ceil(totalNumber / ITEM_PER_PAGE)
			});
		}).catch(error => {
			return next(new Error(error));
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
			return next(new Error(error));
		});
};

exports.getCart = (req, res, next) => {
	let total = 0;
	let ls_products = []

	req.user.populate('cart.productId').execPopulate()
		.then(user => {
			user.cart.map(product => {
				try {
					total += product.quantity * product.productId.price
					ls_products.push(product)
				} catch (e) {
					console.log(e)
				}
			})
			res.render('shop/cart', {
				path: '/cart',
				title_page: 'Your Cart',
				products : ls_products,
				total: total
			});
		})
		.catch(error => {
			return next(new Error(error))
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
			return next(new Error(error))
		})
};

exports.postCartDelete = (req, res, next) => {
	const prodId = req.body.productId;
	req.user.deleteProduct(prodId)
		.then(() => {
			res.redirect('/cart');
		})
		.catch(error => {
			return next(new Error(error))
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
			return next(new Error(error));
		});
}

exports.postUserOrder = (req, res, next) => {

	// Token is created using Stripe Checkout or Elements!
	// Get the payment token ID submitted by the form:
	const token = req.body.stripeToken; // Using Express
	let total = 0;
	let products = [];

	req.user.populate('cart.productId').execPopulate()
		.then(user => {
			user.cart.map(product => {
				try {
					total += product.quantity * product.productId.price
					products.push({quantity : item.quantity, product: {...item.productId._doc}})
				} catch (e) {
					console.error(e)
				}
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
		.then(order => {
			const charge = stripe.charges.create({
				amount: total * 100,
				currency: 'usd',
				description: 'Demo payment',
				source: token,
				metadata: order._id
			});
			return req.user.clearCart();
		})
		.then(() => {
			res.redirect('/order');
		})
		.catch(error => {
			return next(new Error(error));
		});
}

exports.getOrderFilePdf = (req, res, next) => {
	const orderId = req.params.orderId;

	Orders.findById(orderId)
		.then(order => {
			if (!order) {
				return next(new Error('No order found'))
			} else if (order.user.userId.toString() !== req.user._id.toString()) {
				return res.redirect('/404');
			}
			const pdfDoc = new PDFDoc;
			res.setHeader('Content-Type', 'application/pdf');
			pdfDoc.pipe(res);

			pdfDoc.fontSize(26).text('Invoice', {
				underline: true
			});
			pdfDoc.text('---------------------------------')
			let totalOrder = 0
			order.products.map(object => {
				totalOrder += object.quantity * object.product.price
				pdfDoc.fontSize(20).text(object.product.title)
				pdfDoc.fontSize(14).text("Quantity : " + object.quantity)
				pdfDoc.text("Price : " + object.product.price)
				pdfDoc.text(`Total : ${object.quantity * object.product.price}`);

			})
			pdfDoc.fontSize(20).text('---------------------------------')
			pdfDoc.text(`Total order : ${totalOrder}`)

			pdfDoc.end();
		})
		.catch(error => {
			console.error(error)
			return next(error);
		})
}