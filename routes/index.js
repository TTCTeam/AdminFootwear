var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController');
const accountController = require('../controllers/accountController');
const passport = require('passport');
const authenticate = require('../authentication/authenticated');

function loggedIn(req, res, next) {
    if (req.isAuthenticated()) {

        return next();

    } else {
        res.redirect('/login');
    }
};
/* GET home page. */
router.get('/', loggedIn, productController.index);

router.get('/login', function(req, res, next) {
    res.render('login', { title: "Admin Area | Account Login" });
});

router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false
}));

module.exports = router;