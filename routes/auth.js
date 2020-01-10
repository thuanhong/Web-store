const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/auth/login', authController.getLogin);
router.post('/auth/login', authController.postLogin);

module.exports = router;