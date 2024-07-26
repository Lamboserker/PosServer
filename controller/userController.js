import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

// Benutzer registrieren
export const registerUser = [
  // Validierung
  check("name", "Name ist erforderlich").not().isEmpty(),
  check("password", "Passwort ist erforderlich").not().isEmpty(),
  check("role", "Rolle ist ungültig").optional().isIn(["admin", "employee"]),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, password, role } = req.body;

    try {
      const existingUser = await User.findOne({ name });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Benutzername existiert bereits." });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      let userRole = "employee";
      if (role && ["admin", "employee"].includes(role)) {
        userRole = role;
      }

      const result = await User.create({
        name,
        password: hashedPassword,
        role: userRole,
      });

      const token = jwt.sign(
        { name: result.name, id: result._id, role: result.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(201).json({ result, token });
    } catch (error) {
      res.status(500).json({ message: "Etwas ist schiefgelaufen." });
      console.log(error);
    }
  },
];

export const loginUser = [
  // Validierung
  check("name", "Name ist erforderlich").not().isEmpty(),
  check("password", "Passwort ist erforderlich").not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, password } = req.body;

    try {
      const user = await User.findOne({ name });
      if (!user) {
        return res.status(404).json({ message: "Benutzer nicht gefunden." });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Ungültiges Passwort." });
      }

      const token = jwt.sign(
        { name: user.name, id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(200).json({ result: user, token, role: user.role });
    } catch (error) {
      res.status(500).json({ message: "Etwas ist schiefgelaufen." });
      console.error(error);
    }
  },
];

export const getUsernamesByIds = async (req, res) => {
  try {
    const userIds = req.body.userIds; // Die Benutzer-IDs aus dem Request-Body auslesen
    const users = await User.find({ _id: { $in: userIds } }).select("name"); // Namen der Benutzer abrufen

    if (!users.length) {
      return res.status(404).json({ message: "Keine Benutzer gefunden" });
    }

    res.json(users.map((user) => ({ id: user._id, name: user.name })));
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzernamen:", error);
    res
      .status(500)
      .json({ message: "Serverfehler beim Abrufen der Benutzernamen" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzer:", error);
    res.status(500).json({ message: "Serverfehler beim Abrufen der Benutzer" });
  }
};
