import express from "express";
import {
  recordSale,
  getAllSalesByUser,
  searchSales,
  getSalesCount,
  getItemSalesData,
  totalSalesByItem,
  deleteSaleById,
  filterSalesByUsers,
  getSalesPercentageByUsers,
} from "../controller/saleController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to record a new sale
router.post("/", protect, recordSale);

// Route to get all sales of a user
router.get("/user/:userId", protect, getAllSalesByUser);

// Route to search for sales based on start date, end date, and selected items
router.post("/search", protect, searchSales);

// Route to get the total sales count
router.get("/count", protect, admin, getSalesCount);

// Route to get a specific sale - This should come after /count to avoid conflict
// router.get("/:saleId", protect, getSaleById);

// Route zur Ermittlung der Verkaufsdaten der Items
router.get("/sales-data", protect, getItemSalesData);

// Neue Route zur Ermittlung der Gesamtverkäufe nach Artikel
router.get("/total-sales-by-item", protect, admin, totalSalesByItem);

// Route zum Löschen der Verkäufe eines Benutzers
router.delete("/:id", protect, admin, deleteSaleById);

//Route zum filtern von Verkäufen nach Nutzer
router.post("/filter-by-users", protect, filterSalesByUsers);

//Route zum filtern von Verkäufen nach Nutzer und Prozentsatz
router.post("/sales-percentage-by-users", protect, getSalesPercentageByUsers);

export default router;
