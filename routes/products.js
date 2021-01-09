var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController');

function loggedIn(req, res, next) {
    if (req.isAuthenticated()) {

        return next();

    } else {
        res.redirect('/login');
    }
};

router.get('/', loggedIn, productController.index);

router.post('/add', loggedIn, productController.add);
router.get('/edit/:id', loggedIn, productController.editrender);
router.post('/edit/:id', loggedIn, productController.upadate);

router.get('/add', loggedIn, productController.add_get);

router.post('/delete/:id', loggedIn, productController.delete);
module.exports = router;