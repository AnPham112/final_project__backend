const { requireSignin, userMiddleware } = require("../common-middleware");
const { addOrder, getOrders, getOrder, getOrderPublic } = require("../controller/order");
const router = require("express").Router();

router.post("/addOrder", requireSignin, userMiddleware, addOrder);
router.get("/getOrders", requireSignin, userMiddleware, getOrders);
router.post("/getOrder", requireSignin, userMiddleware, getOrder);
router.get("/getOrderPublic", getOrderPublic);

module.exports = router;