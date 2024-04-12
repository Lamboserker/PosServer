import express from "express";
import { recordSale } from "../controller/saleController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Erfassen eines neuen Verkaufs
router.post("/", protect, recordSale);

export default router;
