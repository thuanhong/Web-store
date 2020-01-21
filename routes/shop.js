const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/isAuth')

router.get('/', shopController.getIndex);
router.get('/product/:productID', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete', isAuth, shopController.postCartDelete);

router.get('/order', isAuth, shopController.getUserOrder);
router.post('/order', isAuth, shopController.postUserOrder);

router.get('/order/:orderId', isAuth, shopController.getOrderFilePdf)

module.exports = router;