import Supplier from "../models/Supplier.js";

export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addSupplier = async (req, res) => {
  const { name, contact, email, address } = req.body;

  try {
    const newSupplier = await Supplier.create({ name, contact, email, address });
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { name, contact, email, address } = req.body;

  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      id,
      { name, contact, email, address },
      { new: true }
    );
    res.json(updatedSupplier);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSupplier = async (req, res) => {
  const { id } = req.params;

  try {
    await Supplier.findByIdAndDelete(id);
    res.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};