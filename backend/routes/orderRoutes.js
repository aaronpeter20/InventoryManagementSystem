import express from "express";
import {
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { protect,manager } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getOrders).post(protect, createOrder);
router.route("/:id").put(protect, updateOrderStatus).delete(protect, manager, deleteOrder);

export default router;