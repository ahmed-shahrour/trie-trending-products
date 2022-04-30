const express = require('express');
const router = express.Router();

const productController = require('../controllers/products');

router.get('/trending', productController.getTrendingProducts);

module.exports = router;