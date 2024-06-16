const express = require("express");
const {
  getSingleOrder,
  updateOrderStatus,
  getAllOrders,
  getYearlyOrders,
  getMonthlyOrders,
  getOrderByUserId,
} = require("../controller/orderCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/get-all-orders", authMiddleware, isAdmin, getAllOrders);
router.get("/get-order-by-user", authMiddleware, getOrderByUserId);
router.get("/get-order-by-id/:id", authMiddleware, isAdmin, getSingleOrder);
router.get("/get-monthly-orders", authMiddleware, getMonthlyOrders);
router.get("/get-yearly-orders", authMiddleware, getYearlyOrders);
router.put(
    "/update-order/:id",
    authMiddleware,
    isAdmin,
    updateOrderStatus
  );


module.exports = router;