const User = require('../models/users')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const sendGridTranporter = require('nodemailer-sendgrid-transport')
require('dotenv').config()

const tranporter = nodemailer.createTransport(sendGridTranporter({
    auth: {
        api_key: process.env.SEND_GRID_API
    }
}))


exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/auth/login',
        title_page: 'Login',
        error: req.flash('error'),
        success: req.flash('success')
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    User.findOne({email: email})
        .then(userCollection => {
            if (!userCollection) {
                req.flash('error', 'Your email or password incorrect')
                return res.redirect('/auth/login')
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
                        req.flash('error', 'Your email or password incorrect')
                        res.redirect('/auth/login')
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
                req.flash('error', 'Your email were exist')
                return res.redirect('/auth/login')
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
                    req.flash('success', 'Register successfull, please check your mail to verify your account')
                    res.redirect('/auth/login')
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

exports.getResetPassword = (req, res, next) => {
    res.render('auth/reset', {
        path: '/auth/reset',
        title_page: 'Reset password',
        error: req.flash('error'),
        success: req.flash('success')
    });
}

exports.postResetPassword = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.error(err)
            return res.redirect('/auth/reset-password')
        }
        const token = buffer.toString('hex')
        User.findOne({email: req.body.email})
        .then(userDoc => {
            if (!userDoc) {
                req.flash('error', 'No account with that email found')
                return res.redirect('/auth/reset-password')
            }
            userDoc.resetToken = token;
            userDoc.resetTokenExpired = Date.now() + 3600000;
            return userDoc.save();
        })
        .then(() => {
            req.flash('success', 'Link reset have been sent to your email')
            res.redirect('/auth/reset-password')
            return tranporter.sendMail({
                from: 'thuanhong@neo.com',
                to: req.body.email,
                subject: 'Reset password, link will expried after one hour',
                html: `<a href="http://localhost:8080/auth/reset-password/${token}">Reset Password</a>`  
            }, (err, info) => {
                if (err) console.error(err)
                if (info) console.log(info)
            })
        })
        .catch(error => {
            console.error(error)
        })
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpired: {$gt: Date.now()}})
        .then(user => {
            if (!user) {
                req.flash('error', "Your link don't exist or have been expired")
                return res.redirect('/auth/reset-password')
            }
            res.render('auth/new-password', {
                path: '/auth/new-password',
                title_page: 'New Password',
                // error: req.flash('error'),
                // success: req.flash('success'),
                userId: user._id,
                userToken: token
            })
        })
        .catch(error => {
            console.error(error)
        })
}

exports.postNewPassword = (req, res, next) => {
    const token = req.params.token;
    const userId = req.body.userId;
    const password = req.body.password;
    User.findOne({resetToken: token, resetTokenExpired: {$gt: Date.now()}, _id: userId})
        .then(user => {
            if (!user) {
                req.flash('error', "Your link don't exist or have been expired")
                return res.redirect('/auth/reset-password')
            }
            return bcrypt.hash(password, 12)
                    .then(hashedPassword => {
                        user.password = hashedPassword;
                        user.resetToken = undefined;
                        user.resetTokenExpired = undefined;
                        return user.save()
                    })
                    .then(() => {
                        req.flash('success', 'Reset password successful')
                        res.redirect('/auth/login')
                    })
                    .catch(error => {
                        console.error(error)
                    })
        })
        .catch(error => {
            console.error(error)
        })
}