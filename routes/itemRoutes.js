// itemRoutes.js
import express from "express";
import {
  addItem,
  getItems,
  addPfandToOrder,
} from "../controller/itemController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, admin, addItem).get(getItems);
router.route("/addPfandToOrder").post(protect, addPfandToOrder);

export default router;
