import express from "express";
import {
  registerUser,
  loginUser,
  getUsernamesByIds,
  getAllUsers,
} from "../controller/userController.js";

const router = express.Router();
router.get("/", getAllUsers); 
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/usernames", getUsernamesByIds);
export default router;
