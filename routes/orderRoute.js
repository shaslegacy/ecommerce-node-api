const express = require("express");
const {
  getOrders,
  updateOrderStatus,
  getAllOrders,
  getYearlyOrders,
  getMonthlyOrders,
} = require("../controller/orderCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/get-all-orders", authMiddleware, isAdmin, getAllOrders);
router.post("/get-order-by-user/:id", authMiddleware, isAdmin, getAllOrders);
router.get("/get-orders", authMiddleware, getOrders);
router.get("/get-monthly-orders", authMiddleware, getMonthlyOrders);
router.get("/get-yearly-orders", authMiddleware, getYearlyOrders);
router.put(
    "/update-order/:id",
    authMiddleware,
    isAdmin,
    updateOrderStatus
  );


module.exports = router;