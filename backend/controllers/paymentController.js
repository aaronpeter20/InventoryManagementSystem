import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Replenishment from "../models/Replenishment.js";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { amount, replenishmentId } = req.body;

    if (!amount || !replenishmentId) {
      return res.status(400).json({ message: 'Amount and Replenishment ID are required' });
    }

    const options = {
      amount: amount * 100, 
      currency: 'INR',
      receipt: `replenishment_${replenishmentId}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, replenishmentId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !replenishmentId) {
      return res.status(400).json({ message: 'Missing payment details' });
    }

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = hmac.digest('hex');

    if (expectedSignature === razorpay_signature) {
      await Replenishment.findByIdAndUpdate(replenishmentId, { status: 'Paid' });
      res.json({ message: 'Payment Successful', status: 'Paid' });
    } else {
      res.status(400).json({ message: 'Invalid Payment Signature' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying payment', error });
  }
};