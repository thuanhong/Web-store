const express = require('express');
const app = express();
const bodyPaser = require('body-parser');
const path = require('path');
const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const User = require('./models/users');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const MONGO_URI = 'mongodb+srv://thuanhong:tIatFdS7yMxIhdvQ@cluster0-hyxsy.mongodb.net/shop?retryWrites=true&w=majority'

const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: 'sessions',
});

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyPaser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'my-session', resave: false, saveUninitialized: false, store: store}))

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
})

app.use(shopRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use(errorController.get404);

mongoose.connect(MONGO_URI)
.then(() => {
  User.findOne()
    .then(user => {
      if (!user) {
        const user = new User({
          name: "Thuan",
          email: 'thuanhong357@gmail.com',
          cart: []
        })
        user.save()
      }
    })
  app.listen(3000)
})
.catch(error => {
  console.error(error)
})