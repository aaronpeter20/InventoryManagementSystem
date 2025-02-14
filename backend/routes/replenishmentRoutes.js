import express from "express";
import {
  getReplenishmentRequests,
  requestReplenishment,
  approveReplenishment,
} from "../controllers/replenishmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getReplenishmentRequests).post(protect, requestReplenishment);
router.route("/:id").put(protect, approveReplenishment);

export default router;