import express from "express";
import {
  getInventory,
  addInventory,
  updateInventory,
  deleteInventory,
} from "../controllers/inventoryController.js";
import { protect, manager } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getInventory).post(protect, manager, addInventory);
router.route("/:id").put(protect, manager, updateInventory).delete(protect, manager, deleteInventory);

export default router;