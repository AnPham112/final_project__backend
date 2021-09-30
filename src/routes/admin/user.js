const express = require('express');
const { requireSignin, adminMiddleware } = require('../../common-middleware');
const router = express.Router();
const { getAllUsers, deleteUserById } = require('../../controller/admin/user');

router.get('/getAllUsers', getAllUsers);
router.delete('/user/deleteUserById', requireSignin, adminMiddleware, deleteUserById);

module.exports = router;



