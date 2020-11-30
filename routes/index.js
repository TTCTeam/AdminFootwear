var express = require('express');
var router = express.Router();
const productController=require('../controllers/productController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/products', productController.index)



module.exports = router;
