const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const MIN_AMOUNT_INR = 40;

const createPaymentIntent =  asyncHandler(async (req, res, next) => {
    const amount = req.body.amount;

    if (amount < MIN_AMOUNT_INR) {
        return res.status(400).json({
            success: false,
            message: `Amount must be at least ${MIN_AMOUNT_INR} INR to be valid.`
        });
    }

    const myPayment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "inr",
      payment_method: 'pm_card_visa',
      metadata: {
        company: "Shas Legacy",
      },
    });

    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  });

const stripeApikey = asyncHandler(async (req, res, next) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY });
  });

module.exports = {
  createPaymentIntent,
  stripeApikey
};
