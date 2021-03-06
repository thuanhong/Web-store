const Product = require("../models/products");
const fs = require('fs')


const deleteFile = (filePath) => {
	fs.unlink(filePath, (err) => {
		if (err) {
			console.error(err)
		}
	})
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        path: "/admin/add-product",
        title_page: "Add Product",
		action: "Add ",
		editing: false,
    })
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
	const imgURL = req.file;

	new Product({
		title: title,
		price: price,
		description: description,
		imageURL: '/' + imgURL.path,
		userId: req.user
	}).save()
		.then(() => {
			res.redirect('/admin/products');
		}).catch(error => {
			console.error(error)
			return next(new Error(error))
		});
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect('/');
	}
	const prodId = req.params.productID;
	Product.findById(prodId)
		.then(product => {
			if (!product) {
				return res.redirect('/');
			}
			res.render('admin/edit-product', {
				path: '/admin/products',
				title_page: 'Admin Products',
				action: 'Edit ',
				editing: true,
				product : product,
			})
	}).catch(error => {
		return next(new Error(error))
	});
};

exports.postEditProduct = (req, res, next) => {
	const propID = req.params.productID;
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
	const imgURL = req.file;

	Product.findById(propID)
	    .then(product => {
			product.title = title;
			product.price = price;
			product.description = description;
			if (imgURL) {
				deleteFile(product.imageURL.slice(1))
				product.imageURL = '/' + imgURL.path;
			}
			product.save()
				.then(() => {
					console.log("UPDATED SUCCESSFUL")
					res.redirect('/admin/products')
				})
				
	    }).catch(error => {
	    	return next(new Error(error))
    });

};

exports.getAllProducts = (req, res, next) => {
    Product.find({userId: req.user._id})
      .then(products => {
			res.render('admin/products', {
				products: products,
				path: '/admin/products',
				title_page: 'Admin Products',
			})
      })
      .catch(error => { 
          return next(new Error(error));
      });
};

exports.deleteProduct = (req, res, next) => {
	let productID = req.params.productID;
	Product.findByIdAndDelete(productID)
		.then(product => {
			console.log('DELETE SUCCESSFULLY');
			deleteFile(product.imageURL.slice(1))
			res.redirect('/admin/products')
		})
		.catch(error => {
			return next(new Error(error))
		});
};