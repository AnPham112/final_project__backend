const express = require('express');
const { requireSignin, userMiddleware } = require('../common-middleware');
const router = express.Router();
const {
  signup,
  signin,
  getUserProfile,
  updateUserProfile
} = require('../controller/auth');
const { isRequestValidated, validateSigninRequest, validateSignupRequest } = require('../validators/auth');

router.post('/signup', validateSignupRequest, isRequestValidated, signup);
router.post('/signin', validateSigninRequest, isRequestValidated, signin);
router.get('/profile', requireSignin, userMiddleware, getUserProfile);
router.post('/update', requireSignin, userMiddleware, updateUserProfile);

module.exports = router;