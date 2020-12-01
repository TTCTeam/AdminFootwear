var express = require('express');
var router = express.Router();
const accountController = require('../controllers/accountController');

router.get('/', function(req, res, next) {
    res.render('accounts', { title: 'Accounts' });
});

module.exports = router;