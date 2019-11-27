const express = require('express');
const app = express();
const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');
const bodyPaser = require('body-parser');
const path = require('path');
const errorController = require('./controllers/error');
const mongoConnect = require('./database/database').mongoConnect;

const User = require('./models/users')

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyPaser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5dde036c1c9d4400004083fb')
    .then(user => {
      req.user = user
    })
    .catch(error => {
      console.error(error)
    })
  next();
});

app.use('/admin', adminData.route);
app.use(shopRouter);
app.use(errorController.get404);

mongoConnect(client => {
  app.listen(3000)
})