const express = require('express');
const router = express.Router();
const { upload, requireSignin, adminMiddleware } = require('../../common-middleware');
const { createPage, getPage, getAllPages } = require('../../controller/admin/page');


router.post(
  `/page/create`,
  requireSignin,
  adminMiddleware,
  upload.fields([
    { name: 'banners' },
    { name: 'products' }
  ]), createPage
);
router.get(`/page/:category/:type`, getPage);
router.get(`/page/getAllPages`, getAllPages);

module.exports = router;