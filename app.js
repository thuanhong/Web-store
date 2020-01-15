const express = require('express');
const app = express();
const bodyPaser = require('body-parser');
const path = require('path');
const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const User = require('./models/users');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI

const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: 'sessions',
});
const csrfProtection = csrf({});

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(flash())
app.use(bodyPaser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'my-session', resave: false, saveUninitialized: false, store: store}));

app.use(csrfProtection);
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(errror => {
    console.error(errror)
  })
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLogged;
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(errorController.get404);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  app.listen(process.env.PORT || 8080)
})
.catch(error => {
  console.error(error)
})