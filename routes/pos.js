const express = require('express');

const posController = require('../controllers/pos');

const router = express.Router();

router.get('/cart', posController.getCart);

router.post('/cart', posController.postCart);

router.post('/cart-delete-item', posController.postCartDeleteItem);

router.get('/bills', posController.getBills);

router.post('/create-bill', posController.postCreateBill);

router.get('/', posController.getIndex);

module.exports = router;
