exports.getLogin = (req, res, next) => {
    console.log(req.session.isLogged)
    res.render('auth/login', {
        path: '/auth/login',
        title_page: 'Login',
        isAuthenticated: false
    })
}

exports.postLogin = (req, res, next) => {
    req.session.isLogged = true;
    res.redirect('/')
}