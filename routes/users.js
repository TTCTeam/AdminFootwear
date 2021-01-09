var express = require('express');
var router = express.Router();

function loggedIn(req, res, next) {
    if (req.isAuthenticated()) {

        return next();

    } else {
        res.redirect('/login');
    }
};

/* GET users listing. */
router.get('/', loggedIn, function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;