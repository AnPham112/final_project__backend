const express = require('express');
const router = express.Router();
const { signup, signin, signout } = require('../../controller/admin/auth');

router.post('/admin/signup', signup);
router.post('/admin/signin', signin);
router.post('/admin/signout', signout);

module.exports = router;