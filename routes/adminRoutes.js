import express from "express";
import { getSales } from "../controller/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/sales", protect, admin, getSales);

export default router;
