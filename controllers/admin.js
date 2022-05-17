const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('admin/products', {
        pageTitle: 'Products | Admin',
        path: '/admin/products',
        admin: true,
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    admin: true,
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;
  const image = req.body.image;

  Product.create({
    name: name,
    price: price,
    image: image,
  })
    .then((result) => {
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.editing;
  if (!editMode) {
    res.redirect('/admin/products');
  }
  const productId = req.params.id;
  Product.findByPk(productId)
    .then((product) => {
      console.log(product);
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/add-product',
        admin: true,
        editing: true,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.update(
    {
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
    },
    { where: { id: productId } },
  )
    .then((result) => {
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.findByPk(productId)
    .then((product) => {
      product.destroy();
    })
    .then((result) => {
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};
