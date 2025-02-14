import express from "express";
import { getUsers, deleteUser, updateUser } from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, admin, getUsers);
router.route("/:id").delete(protect, admin, deleteUser).put(protect, updateUser);

export default router;