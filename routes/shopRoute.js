const express = require("express");
const { 
        createShop, 
        shopActivation, 
        loginSeller, 
        getSeller, 
        sellerLogOut, 
        getShopInfo, 
        updateShopInfo,
        updateShopAvatar, 
        getAllSellers, 
        deleteSeller, 
        updateWithdrawMethods,
        deleteWithdrawMethod
    } = require("../controller/shopCtrl");

const { isSeller, isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/create-shop", createShop);
router.post("/activation", shopActivation);
router.post("/seller-login", loginSeller);
router.get("/get-seller", isSeller, getSeller);
router.get("/seller-logout", sellerLogOut);
router.get("/get-shop-info/:id", getShopInfo);
router.put("/update-seller-info", isSeller, updateShopInfo);
router.put("/update-seller-avatar", isSeller, updateShopAvatar);
router.get("/get-all-sellers", authMiddleware, isAdmin, getAllSellers);
router.delete("/delete-seller/:id", authMiddleware, isAdmin, deleteSeller);
router.put("/update-payment-methods", isSeller, updateWithdrawMethods);
router.delete("/delete-payment-methods", isSeller, deleteWithdrawMethod);
module.exports = router;
