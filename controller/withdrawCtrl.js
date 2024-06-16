const Shop = require("../models/shopModel");
const asyncHandler = require("express-async-handler");
const express = require("express");
const Withdraw = require("../models/withdrawModel");
const sendMail = require("../utils/sendMail");
const router = express.Router();


const createWithdrawRequest = asyncHandler(async (req, res, next) => {
    try {
      const { amount } = req.body;

      const data = {
        seller: req.seller,
        amount,
      };

      try {
        await sendMail({
          email: req.seller.email,
          subject: "Withdraw Request",
          message: `Hello ${req.seller.name}, Your withdraw request of INR ${amount} is processing. It will take 3days to 7days to processing! `,
        });
        res.status(201).json({
          success: true,
        });
      } catch (error) {
        throw new Error(error);
      }

      const withdraw = await Withdraw.create(data);

      const shop = await Shop.findById(req.seller._id);

      shop.availableBalance = shop.availableBalance - amount;

      await shop.save();

      res.status(201).json({
        success: true,
        withdraw,
      });
    } catch (error) {
        throw new Error(error);
    }
  });


  const getAllWithdrawRequest = asyncHandler(async (req, res, next) => {
    try {
      const withdraws = await Withdraw.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        withdraws,
      });
    } catch (error) {
        throw new Error(error);
    }
  });

// // update withdraw request ---- admin
const updateWithdrawRequest = asyncHandler(async (req, res, next) => {
  try {
    const { sellerId } = req.body;

    const withdraw = await Withdraw.findByIdAndUpdate(
      req.params.id,
      {
        status: "succeed",
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!withdraw) {
      return res.status(404).json({ success: false, message: "Withdraw request not found" });
    }

    const seller = await Shop.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    if (!Array.isArray(seller.transactions)) {
      seller.transactions = [];
    }

    const transactions = {
      _id: withdraw._id,
      amount: withdraw.amount,
      updatedAt: withdraw.updatedAt,
      status: withdraw.status,
    };

    seller.transactions.push(transactions);

    await seller.save();

    try {
      await sendMail({
        email: seller.email,
        subject: "Payment confirmation",
        message: `Hello ${seller.name}, Your withdraw request of INR ${withdraw.amount} is on the way. Delivery time depends on your bank's rules; it usually takes 3 to 7 days.`,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Error sending email');
    }

    res.status(201).json({
      success: true,
      withdraw,
    });
  } catch (error) {
    console.error('Error updating withdraw request:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});


module.exports = {
    createWithdrawRequest,
    getAllWithdrawRequest,
    updateWithdrawRequest
  };