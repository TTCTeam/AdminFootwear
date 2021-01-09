var express = require('express');
var router = express.Router();
const accountController = require('../controllers/accountController');

function loggedIn(req, res, next) {
    if (req.isAuthenticated()) {

        return next();

    } else {
        res.redirect('/login');
    }
};

router.get('/', loggedIn, accountController.index);

// router.post('/add', accountController.add);
router.get('/add', loggedIn, function(req, res, next) {
    res.render('user/add_user', { title: "Add Account" });
});

router.post('/add', loggedIn, accountController.addNewAccount);

// router.get('/edit/:id', accountController.editrender);
// router.post('/edit/:id', accountController.upadate);

// router.get('/add', accountController.add_get);

// router.post('/delete/:id', accountController.delete);
module.exports = router;