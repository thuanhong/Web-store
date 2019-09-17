const express = require('express');
const app = express();
const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');
const bodyPaser = require('body-parser');
const path = require('path');
const sequelize = require('./database/database');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyPaser.urlencoded({extended: false}));
app.use('/admin', adminData.route);
app.use(shopRouter);
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.status(404).send('<h1>404 Not Found</h1>')
});

sequelize.sync()
  .then(result => {
    app.listen(8000, () => {
      console.log('Server running at localhost:8000');
    });
  })
  .catch(error => {
    console.log(error);
  });