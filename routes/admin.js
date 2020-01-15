const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');

router.get('/products', isAuth, adminController.getAllProducts);

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post('/add-product', isAuth, adminController.postAddProduct);

router.get('/edit-product/:productID', isAuth, adminController.getEditProduct);

router.post('/edit-product/:productID', isAuth, adminController.postEditProduct);

router.get('/delete/:productID', isAuth, adminController.deleteProduct);

module.exports = router;