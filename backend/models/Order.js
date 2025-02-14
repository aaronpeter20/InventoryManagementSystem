import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory", required: true },
    quantity: { type: Number, required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    replenishmentRequest: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;