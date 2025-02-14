import express from "express";
import Inventory from "../models/Inventory.js";
import Supplier from "../models/Supplier.js";
import Order from "../models/Order.js";

const router = express.Router();

router.get("/metrics", async (req, res) => {
  try {
    const inventoryCount = await Inventory.countDocuments();
    const supplierCount = await Supplier.countDocuments();
    const orderCount = await Order.countDocuments();

    res.json({ inventoryCount, supplierCount, orderCount });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({ message: "Failed to fetch metrics" });
  }
});

export default router;