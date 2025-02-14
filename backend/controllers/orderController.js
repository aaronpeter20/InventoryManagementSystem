import Order from "../models/Order.js";
import Inventory from "../models/Inventory.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("item employee");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createOrder = async (req, res) => {
  const { item, quantity } = req.body;
  const employee = req.user._id;

  try {
    const newOrder = await Order.create({ item, quantity, employee });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status === "approved") {
      const item = await Inventory.findById(order.item);
      if (!item) {
        return res.status(404).json({ message: "Item not found in inventory" });
      }

      if (item.quantity < order.quantity) {
        return res.status(400).json({ error: "Out of stock! Cannot approve this order." });
      }

      item.quantity -= order.quantity;
      await item.save();
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    await Order.findByIdAndDelete(id);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};