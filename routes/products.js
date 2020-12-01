var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController');

router.get('/', function(req, res, next) {
    res.render('products', { title: 'Product' });
});

module.exports = router;