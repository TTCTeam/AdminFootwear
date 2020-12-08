var express = require('express');
var router = express.Router();
const accountController = require('../controllers/accountController');

router.get('/', accountController.index);

// router.post('/add', accountController.add);
// router.get('/edit/:id', accountController.editrender);
// router.post('/edit/:id', accountController.upadate);

// router.get('/add', accountController.add_get);

// router.post('/delete/:id', accountController.delete);
module.exports = router;