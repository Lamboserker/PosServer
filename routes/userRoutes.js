import express from "express";
import { registerUser, loginUser } from "../controller/userController.js";

const router = express.Router();

// Registrierung eines neuen Benutzers
router.post("/register", registerUser);

// Anmeldung eines Benutzers
router.post("/login", loginUser);



export default router;
