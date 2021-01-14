const express = require('express');
const { route } = require('..');
const router = express.Router();

const productApiController = require('../../controllers/api/productApiController');

router.get('/restore', productApiController.restoreProduct);
router.get('/delete', productApiController.deleteProduct);
module.exports = router;