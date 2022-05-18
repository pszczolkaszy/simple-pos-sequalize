const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('pos/index', {
        pageTitle: 'Simple POS',
        path: '/',
        admin: false,
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  let totalPrice;
  req.user
    .getCart()
    .then((cart) => {
      totalPrice = cart.totalPrice;
      return cart
        .getProducts()
        .then((products) => {
          res.render('pos/cart', {
            pageTitle: 'Cart',
            path: '/cart',
            products: products,
            admin: true,
            totalPrice: totalPrice,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(productId);
    })
    .then((product) => {
      fetchedCart.totalPrice += product.price;
      fetchedCart.save();
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect('cart');
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteItem = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  console.log(productId);
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];
      console.log(product);
      fetchedCart.totalPrice -= product.price * product.cartItem.quantity;
      fetchedCart.save();
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.getBills = (req, res, next) => {
  req.user
    .getBills({ include: ['products', 'user'] })
    .then((bills) => {
      console.log(bills);
      res.render('pos/bills', {
        pageTitle: 'Bills',
        path: '/bills',
        bills: bills,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCreateBill = (req, res, next) => {
  const paymentType = req.body.paymentType;
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createBill()
        .then((bill) => {
          bill.totalPrice = fetchedCart.totalPrice;
          bill.paymentType = paymentType;
          bill.save();
          bill.addProducts(
            products.map((product) => {
              product.billItem = { quantity: product.cartItem.quantity };
              return product;
            }),
          );
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      fetchedCart.totalPrice = 0;
      fetchedCart.save();
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect('/bills');
    })
    .catch((err) => console.log(err));
};
