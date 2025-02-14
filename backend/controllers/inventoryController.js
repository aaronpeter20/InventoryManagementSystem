import Inventory from "../models/Inventory.js";

export const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate("supplier");
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addInventory = async (req, res) => {
  const { name, description, quantity, price, supplier } = req.body;

  try {
    const newItem = await Inventory.create({ name, description, quantity, price, supplier });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to update item" });
  }
};

export const deleteInventory = async (req, res) => {
  const { id } = req.params;

  try {
    await Inventory.findByIdAndDelete(id);
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};