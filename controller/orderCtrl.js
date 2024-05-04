const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");


  const getAllOrders = asyncHandler(async (req, res) => {
    try {
      const alluserorders = await Order.find()
        .populate("products.product")
        .populate("orderby")
        .exec();
      res.json(alluserorders);
    } catch (error) {
      throw new Error(error);
    }
  });


 const getOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
      const userorders = await Order.findOne({ orderby: _id })
        .populate("products.product")
        .populate("orderby")
        .exec();
      res.json(userorders);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  const getOrderByUserId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const userorders = await Order.findOne({ orderby: id })
        .populate("products.product")
        .populate("orderby")
        .exec();
      res.json(userorders);
    } catch (error) {
      throw new Error(error);
    }
  });

  const getMyOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
      const userorders = await Order.find({ user: _id });
      res.json({userorders});
    } catch (error) {
      throw new Error(error);
    }
  })
  
  const getMonthlyOrders = asyncHandler(async (req, res) => {
    let monthsName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let d = new Date();
    let endDate = "";
    d.setDate(1);
  
    for(let i = 0; i < 11; i++) {
      d.setMonth(d.getMonth() - 1);
      endDate = monthsName[d.getMonth()] + " " + d.getFullYear();
    }
      const data = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(endDate),
              $lte: new Date()
            }
          }
        },
        {
          $group: {
            _id: {
              month: "$month"
            },
            amount: {
              $sum: "$paymentIntent.amount"
            },
            count: {
              $sum: 1
            }
          }
        }
      ])
      res.json(data);
  });
  
  const getYearlyOrders = asyncHandler(async (req, res) => {
    let monthsName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let d = new Date();
    let endDate = "";
    d.setDate(1);
  
    for(let i = 0; i < 11; i++) {
      d.setMonth(d.getMonth() - 1);
      endDate = monthsName[d.getMonth()] + " " + d.getFullYear();
    }
      const data = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(endDate),
              $lte: new Date()
            }
          }
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            amount: { $sum: "$paymentIntent.amount" }
          }
        }
      ])
      res.json(data);
  });
  
  const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const updateOrderStatus = await Order.findByIdAndUpdate(
        id,
        {
          orderStatus: status,
          paymentIntent: {
            status: status,
          },
        },
        { new: true }
      );
      res.json(updateOrderStatus);
    } catch (error) {
      throw new Error(error);
    }
  });

  module.exports = {
    getOrders,
    updateOrderStatus,
    getAllOrders,
    getOrderByUserId,
    getMyOrders,
    getMonthlyOrders,
    getYearlyOrders
  };