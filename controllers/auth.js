const User = require('../models/users')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendGridTranporter = require('nodemailer-sendgrid-transport')
require('dotenv').config()

const tranporter = nodemailer.createTransport(sendGridTranporter({
    auth: {
        api_key: process.env.SEND_GRID_API
    }
}))


exports.getLogin = (req, res, next) => {
    const show = req.query.show
    res.render('auth/login', {
        path: '/auth/login',
        title_page: 'Login',
        isAuthenticated: false,
        show: show
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    User.findOne({email: email})
        .then(userCollection => {
            if (!userCollection) {
                return res.redirect('/auth/login?show=Your email or password incorrect')
            }
            bcrypt.compare(password, userCollection.password)
                .then(result => {
                    if (result === true) {
                        req.session.user = userCollection;
                        req.session.isLogged = true;
                        // Make sure session have been save before navigate
                        req.session.save(error => {
                            console.error(error)
                            res.redirect('/')
                        })
                    } else {
                        res.redirect('/auth/login?show=Your email or password incorrect')
                    }
                })
        })
        .catch(errror => {
            console.error(errror)
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
    User.findOne({email: email})
        .then(userDoc => {
            if (userDoc) {
                return res.redirect('/auth/login?show=Your email were exist')
            }
            return bcrypt.hash(password, 12)
                .then(hashPassword => {
                    const newUser = new User({
                        name: user,
                        email: email,
                        password: hashPassword
                    })
                    return newUser.save();
                })
                .then(() => {
                    res.redirect('/auth/login?show=Register successfull, please check your mail to verify your account')
                    return tranporter.sendMail({
                        from: 'thuanhong@neo.com',
                        to: email,
                        subject: 'Verify your email',
                        html: '<a href="https://github.com/">Click to verify</a>'   
                    }, (err, info) => {
                        if (err) console.error(err)
                        if (info) console.log(info)
                    })
                })
        })
        .catch(err => {
            console.error(err)
        })
}