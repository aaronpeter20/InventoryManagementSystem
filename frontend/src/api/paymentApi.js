import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payment';

export const createRazorpayOrder = async (amount, replenishmentId) => {
  const { data } = await axios.post(`${API_URL}/order`, { amount, replenishmentId });
  return data;
};

export const verifyRazorpayPayment = async (paymentDetails) => {
  const { data } = await axios.post(`${API_URL}/verify`, paymentDetails);
  return data;
};