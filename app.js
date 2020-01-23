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
const multer = require('multer');
const mkdirp = require('mkdirp')
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

const multerStore = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = 'images/';
    mkdirp.sync(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

app.use(flash())
app.use(bodyPaser.urlencoded({extended: false}));
app.use(multer({storage: multerStore, fileFilter: fileFilter}).single('image'))

app.use('/images', express.static(path.join(__dirname, 'images')))
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
  .catch(error => {
    console.error(error)
    next(new Error(error))
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

app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).render('error/error500', {
    path: '/500',
    title_page: 'Server Error',
  });
})

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  app.listen(process.env.PORT || 8080)
})
.catch(error => {
  console.error(error)
})