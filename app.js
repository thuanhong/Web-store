const express = require('express');
const app = express();
const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');
const bodyPaser = require('body-parser');
const path = require('path');
const errorController = require('./controllers/error');
const database = require('./database/database');

const User = require('./models/users');
const Product = require('./models/products');
const Cart = require('./models/carts');
const CartItem = require('./models/cart-items');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyPaser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(error => {
      console.log(error);
    });
});

app.use('/admin', adminData.route);
app.use(shopRouter);
app.use(errorController.get404);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});
Product.belongsToMany(Order, {through: OrderItem});

database.sync()
  .then(() => {
    return User.findByPk(1); })
  .then(user => {
    if (!user) {
      return User.create({name: "Neo", email: "thuanhong357@gmail.com"})
    }
    return user
  })
  .then(user => {
    return user.createCart()
  })
  .then(() => {
    app.listen(8000, () => {
      console.log("Server running at http://localhost:8000")
    });
  })
  .catch(error => {
    console.log(error);
  });