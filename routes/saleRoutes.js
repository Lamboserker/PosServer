import express from "express";
import {
  getSaleById,
  recordSale,
  getAllSalesByUser,
} from "../controller/saleController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Erfassen eines neuen Verkaufs
router.post("/", protect, recordSale);
router.get("/:saleId", protect, getSaleById); // Route zum Abrufen eines spezifischen Verkaufs
router.get("/user/:userId", protect, getAllSalesByUser); // Route zum Abrufen aller Verkäufe eines Benutzers
export default router;
