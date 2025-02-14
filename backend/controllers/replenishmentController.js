import Replenishment from "../models/Replenishment.js";
import Inventory from "../models/Inventory.js";

export const getReplenishmentRequests = async (req, res) => {
  try {
    const requests = await Replenishment.find().populate("item supplier");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching replenishment requests" });
  }
};

export const requestReplenishment = async (req, res) => {
  const { item, quantity, supplier } = req.body;
  const requestedBy = req.user ? req.user.id : null; // Ensure requestedBy is set

  if (!item || !quantity || !supplier || !requestedBy) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingItem = await Inventory.findById(item);
    if (!existingItem) {
      return res.status(404).json({ message: "Item not found in inventory" });
    }

    const replenishment = new Replenishment({
      item,
      quantity,
      supplier,
      requestedBy, 
      status: "Pending",
    });

    await replenishment.save();
    res.status(201).json(replenishment);
  } catch (error) {
    console.error("Replenishment Request Error:", error);
    res.status(500).json({ message: "Error submitting request", error: error.message });
  }
};

export const approveReplenishment = async (req, res) => {
  try {
    const request = await Replenishment.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "Approved";
    await request.save();

    const inventoryItem = await Inventory.findById(request.item);
    inventoryItem.quantity += request.quantity;
    await inventoryItem.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Error approving request" });
  }
};