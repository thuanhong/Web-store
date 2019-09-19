const Product = require("../models/products");

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        path: "/admin/add-product",
        title_page: "Add Product",
	      action: "Add ",
	      editing: false
    })
};

exports.postAddProduct = (req, res, next) => {
    let title = req.body.title;
    let price = req.body.price;
    let description = req.body.description;
    let imgURL = req.body.url;
    req.user.createProduct({
        title: title,
        price: price,
        imageURL: imgURL,
        description: description
    }).then(result => {
        console.log(result);
        res.redirect('/admin/products');
    }).catch(error => {
        console.log(error)
    });
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect('/');
	}
	const prodId = req.params.productID;
	req.user.getProducts({where: {id: prodId}})
		.then(products => {
			console.log(products);
			let product = products[0];
			if (!product) {
				return res.redirect('/');
			}
			res.render('admin/edit-product', {
				path: '/admin/products',
				title_page: 'Admin Products',
				action: 'Edit ',
				editing: true,
				product : product
			})
	}).catch(error => {
		console.log(error)
	});
};

exports.postEditProduct = (req, res, next) => {
		let propID = req.params.productID;
    let title = req.body.title;
    let price = req.body.price;
    let description = req.body.description;
    let imgURL = req.body.url;
    Product.findByPk(propID)
	    .then(product => {
	    	product.title = title;
	    	product.price = price;
	    	product.description = description;
	    	product.imageURL = imgURL;
	    	product.save().then(() => {
	    		console.log("SUCCESSFULLY")
		    });
		    res.redirect('admin/products');
	    }).catch(error => {
	    	console.log(error)
    });

};

exports.getAllProducts = (req, res, next) => {
    Product.findAll()
      .then(products => {
          res.render('admin/products', {
              products: products,
              path: '/admin/products',
              title_page: 'Admin Products'
          })
      })
      .catch(error => {
          console.log(error);
      });
};

exports.deleteProduct = (req, res, next) => {
	let productID = req.params.productID;
	Product.findByPk(productID)
		.then(product => {
			product.destroy();
		})
		.then(result => {
			console.log('DELETE SUCCESSFULLY');
			res.redirect('/admin/products')
		})
		.catch(error => {
			console.log(error)
		});
};