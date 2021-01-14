var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController');


router.get('/', productController.index);

router.get('/edit/:id', productController.editrender);
router.post('/edit/:id', productController.upadate);

router.get('/add', productController.add_get);
router.post('/add', productController.addNewProduct);

router.post('/delete/:id', productController.delete);
module.exports = router;