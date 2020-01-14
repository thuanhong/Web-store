const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/auth/login', authController.getLogin);
router.post('/auth/login', authController.postLogin);
router.post('/auth/logout', authController.postLogout);

module.exports = router;