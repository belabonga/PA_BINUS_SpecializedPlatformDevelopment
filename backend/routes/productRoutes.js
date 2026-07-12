const express = require('express');
const { getProducts, getProductById, getProductMeta } = require('../controllers/productController');

const router = express.Router();

router.get('/meta', getProductMeta);
router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;
