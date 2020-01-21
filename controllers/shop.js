const Products = require("../models/products");
const Orders = require('../models/orders');
const PDFDoc = require('pdfkit');

const ITEM_PER_PAGE = 1

exports.getIndex = (req, res, next) => {
	const page = req.query.page;
	let totalNumber;
	Products.find().countDocuments()
		.then(total => {
			totalNumber = total;
			return Products.find().skip((page-1) * ITEM_PER_PAGE).limit(ITEM_PER_PAGE)
		})
		.then(product => {
			console.log(totalNumber)
			console.log(page === undefined ? 2 : page * ITEM_PER_PAGE < totalNumber ? page + 1 : undefined)
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
	req.user.populate('cart.productId').execPopulate()
		.then(user => {
			res.render('shop/cart', {
				path: '/cart',
				title_page: 'Your Cart',
				products : user.cart,
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