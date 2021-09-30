const express = require('express');
const router = express.Router();
const { requireSignin, adminMiddleware } = require('../../common-middleware');
const { updateOrder, getCustomerOrders } = require('../../controller/admin/order.admin');

router.post(`/order/update`, requireSignin, adminMiddleware, updateOrder);
router.post(`/order/getCustomerOrders`, requireSignin, adminMiddleware, getCustomerOrders);

module.exports = router;