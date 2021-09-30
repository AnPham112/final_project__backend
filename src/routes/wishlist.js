const express = require('express');
const router = express.Router();

const { requireSignin, userMiddleware } = require('../common-middleware');
const { getWishListItems, addItemToWishList, removeWishListItems } = require('../controller/wishlist');

router.post('/user/wishList/addToWishList', requireSignin, userMiddleware, addItemToWishList);
router.post('/user/getWishListItems', requireSignin, userMiddleware, getWishListItems);
router.post('/user/wishList/removeItem', requireSignin, userMiddleware, removeWishListItems);

module.exports = router;