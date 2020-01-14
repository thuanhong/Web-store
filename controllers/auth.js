const User = require('../models/users')

exports.getLogin = (req, res, next) => {
    console.log(req.session.isLogged)
    res.render('auth/login', {
        path: '/auth/login',
        title_page: 'Login',
        isAuthenticated: false
    })
}

exports.postLogin = (req, res, next) => {
    User.findById('5e16e64dec4afd3698972a20')
        .then(user => {
            req.session.user = user;
            req.session.isLogged = true;
            res.redirect('/')
        })
        .catch(error => {
            console.error(error)
        })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(error => {
        console.error(error)
        res.redirect('/')
    })
}