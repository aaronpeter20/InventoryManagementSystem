import express from "express";
import {
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";
import { protect, manager } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getSuppliers).post(protect, manager, addSupplier);
router.route("/:id").put(protect, manager, updateSupplier).delete(protect, manager, deleteSupplier);

export default router;