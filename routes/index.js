var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController');
const accountController = require('../controllers/accountController');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Dashboard' });
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: "Admin Area | Account Login" });
});
module.exports = router;