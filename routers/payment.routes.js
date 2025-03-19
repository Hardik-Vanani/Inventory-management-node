require("dotenv").config();
const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");


// Initialize Razorpay with Test Keys
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay Test Key ID
    key_secret: process.env.RAZORPAY_KEY_SECRET, // Replace with your Razorpay Test Key Secret
});

router.get("/getPaymentDetails/:paymentId", async (req, res) => {
    const { paymentId } = req.params;
  
    try {
      const payment = await razorpay.payments.fetch(paymentId);
      res.json({
        paymentId: payment.id,
        amount: payment.amount / 100, // Convert back to rupees
        currency: payment.currency,
        status: payment.status,
        createdAt: payment.created_at,
      });
    } catch (error) {
      console.error("Error fetching payment details:", error);
      res.status(500).json({ error: "Failed to fetch payment details" });
    }
  }),

// Create a Razorpay Order
router.post("/createOrder", async (req, res) => {
    const { amount, currency } = req.body;

    const options = {
        amount: amount, // Amount in paise (e.g., 49900 for ₹499)
        currency: currency,
        receipt: "order_rcptid_11",
    };

    try {
        const response = await razorpay.orders.create(options);
        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating order");
    }
});

// Verify Payment
router.post("/verifyPayment", async (req, res) => {
    const { orderCreationId, razorpayPaymentId, razorpaySignature } = req.body;

    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
    const digest = shasum.digest("hex");

    if (digest === razorpaySignature) {
        res.json({ msg: "success" });
    } else {
        res.status(400).json({ msg: "failure" });
    }
});

module.exports = router;