const express = require('express');
const app = express();
const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');
const bodyPaser = require('body-parser');
const path = require('path');
const errorController = require('./controllers/error');
const mongoose = require('mongoose')


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyPaser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.route);
app.use(shopRouter);
app.use(errorController.get404);

mongoose.connect(
  'mongodb+srv://thuanhong:tIatFdS7yMxIhdvQ@cluster0-hyxsy.mongodb.net/shop?retryWrites=true&w=majority')
.then(() => {
  app.listen(3000)
})
.catch(error => {
  console.error(error)
})