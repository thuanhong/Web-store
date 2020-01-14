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
            // Make sure session have been save before navigate
            req.session.save(error => {
                console.error(error)
                res.redirect('/')
            })
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

exports.postSignUp = (req, res, next) => {
    const user = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    new User({
        name: user,
        email: email,
        password: password
    }).save().then(() => {
        res.redirect('/auth/login')
    })
    .catch(err => {
        console.error(err)
    })
}