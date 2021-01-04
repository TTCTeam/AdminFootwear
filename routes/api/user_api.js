const express = require('express');
const { route } = require('..');
const router = express.Router();

const userControllerApi = require('../../controllers/api/userController');

router.get('/paging', userControllerApi.productsPaging);

module.exports = router;