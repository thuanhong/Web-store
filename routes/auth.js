const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

const isLogged = (req, res, next) => {
    if (req.session.isLogged) {
        return res.redirect('/')
    }
    next();
}

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/signup', authController.postSignUp);
router.get('/reset-password', isLogged, authController.getResetPassword);
router.post('/reset-password', isLogged, authController.postResetPassword)

module.exports = router;