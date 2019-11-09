const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getAllProduct);
router.get('/product/:productID', shopController.getProduct);

router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.post('/cart-delete', shopController.postCartDelete);

router.get('/order', shopController.getUserOrder);
router.post('/order', shopController.postUserOrder);

router.get('/checkout', shopController.getCheckout);

module.exports = router;