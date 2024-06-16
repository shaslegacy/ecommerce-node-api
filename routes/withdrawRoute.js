const express = require("express");
const { 
    createWithdrawRequest, 
    getAllWithdrawRequest,
    updateWithdrawRequest
    } = require("../controller/withdrawCtrl");

const { isSeller, isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/create-withdraw-request", isSeller, createWithdrawRequest);
router.get("/get-all-withdraw-request", authMiddleware, isAdmin, getAllWithdrawRequest);
router.put("/update-withdraw-request/:id", authMiddleware, isAdmin, updateWithdrawRequest);
module.exports = router;
