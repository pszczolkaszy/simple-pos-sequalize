const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorControler = require('./controllers/error');
const sequelize = require('./util/database');
const Cart = require('./models/cart');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const posRoutes = require('./routes/pos');
const adminRoutes = require('./routes/admin');
const Product = require('./models/product');
const CartItem = require('./models/cart-item');
const User = require('./models/user');
const Bill = require('./models/bill');
const BillItem = require('./models/bill-item');

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(posRoutes);

app.use(errorControler.get404);

Product.belongsTo(User, { constrains: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Bill.belongsTo(User);
User.hasMany(Bill);
Bill.belongsToMany(Product, { through: BillItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'Szymon' });
    }
    return user;
  })
  .then((user) => {
    user.getCart().then((cart) => {
      if (!cart) {
        user.createCart();
      }
      return cart;
    });
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
