const express = require('express');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');
const router = express.Router();
const { adminMiddleware, requireSignin, userMiddleware } = require('../common-middleware');
const {
  createProduct,
  getProductsBySlug,
  getProductDetailsById,
  deleteProductById,
  getProducts,
  createReview,
  getReviews,
  getHomeProducts,
  getWriters
} = require('../controller/product');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), 'uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '-' + file.originalname)
  }
})

const upload = multer({ storage });

router.post('/product/create', requireSignin, adminMiddleware, upload.array('productPicture'), createProduct);
router.get('/products/:slug', getProductsBySlug);
router.get('/product/:productId', getProductDetailsById);
router.post('/comment/createReview', requireSignin, userMiddleware, createReview);
router.post('/comment/getReviews', getReviews);
router.delete('/product/deleteProductById', requireSignin, adminMiddleware, deleteProductById);
router.post('/product/getProducts', requireSignin, adminMiddleware, getProducts);
router.get('/getProducts', getHomeProducts);

module.exports = router;