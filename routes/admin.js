const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.get('/products', adminController.getAllProducts);

router.get('/add-product', adminController.getAddProduct);

router.post('/add-product', adminController.postAddProduct);

// router.get('/edit-product/:productID', adminController.getEditProduct);

// router.post('/edit-product/:productID', adminController.postEditProduct);

// router.get('/delete/:productID', adminController.deleteProduct);

exports.route = router;