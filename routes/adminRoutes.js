import express from "express";
import { getSales } from "../controller/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ändere die Route von "http://localhost:3000/api/users/sales" zu "/sales"
router.get("/sales", protect, admin, getSales);

export default router;
