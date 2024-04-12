// itemRoutes.js
import express from "express";
import { addItem, getItems } from "../controller/itemController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, admin, addItem).get(getItems);

export default router;
