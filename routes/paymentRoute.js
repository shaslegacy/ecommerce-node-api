const express = require("express");
const {
    createPaymentIntent,
    stripeApikey
} = require("../controller/paymentCtrl");
const router = express.Router();

router.post("/process", createPaymentIntent);
router.get("/stripeapikey", stripeApikey);

module.exports = router;
