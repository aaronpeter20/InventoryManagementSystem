import mongoose from "mongoose";

const replenishmentSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory", required: true },
  quantity: { type: Number, required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  status: {
    type: String,
    enum: ["Pending", "Approved", "Paid"], 
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const Replenishment = mongoose.model("Replenishment", replenishmentSchema);
export default Replenishment;