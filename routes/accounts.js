var express = require('express');
var router = express.Router();
const accountController = require('../controllers/accountController');


router.get('/', accountController.index);

// router.post('/add', accountController.add);
router.get('/add', function(req, res, next) {
    console.log(req.params);
    res.render('user/add_user', { title: "Add Account" });
});

router.post('/add', accountController.addNewAccount);

router.get('/edit/:id', accountController.editrender);
router.post('/edit/:id', accountController.editupadate);

router.get('/change_password', function(req, res, next) {
    res.render('user/change_password', { title: "Admin Are | Change Password" });
});

router.post('/change_password', accountController.updatePassword);
// router.get('/add', accountController.add_get);

// router.post('/delete/:id', accountController.delete);
module.exports = router;