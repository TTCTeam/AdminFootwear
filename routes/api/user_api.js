const express = require('express');
const { route } = require('..');
const router = express.Router();

const userControllerApi = require('../../controllers/api/userController');


router.get('/product_paging', userControllerApi.productsPaging);
router.get('/account_paging', userControllerApi.accountsPaging);
router.get('/is-exist-username', userControllerApi.accountExist_Username);
router.get('/is-exist-email', userControllerApi.accountExist_Email);
router.get('/is-correct-password', userControllerApi.checkValidPassword);
module.exports = router;