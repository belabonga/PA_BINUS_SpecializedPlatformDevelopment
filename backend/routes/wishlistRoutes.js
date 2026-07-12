const express = require('express');
const { getWishlist, addToWishlist, deleteWishlistItem } = require('../controllers/wishlistController');

const router = express.Router();

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', deleteWishlistItem);

module.exports = router;
