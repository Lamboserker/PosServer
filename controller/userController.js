import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Benutzer registrieren
export const registerUser = async (req, res) => {
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
      { expiresIn: "1h" }
    );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Etwas ist schiefgelaufen." });
    console.log(error);
  }
};

export const loginUser = async (req, res) => {
  const { name, password } = req.body;

  try {
    // Suche nach dem Benutzer anhand des Benutzernamens
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden." });
    }

    // Überprüfen des Passworts
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Ungültiges Passwort." });
    }

    // Erstellen eines JWT-Tokens
    const token = jwt.sign(
      { name: user.name, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: user, token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Etwas ist schiefgelaufen." });
    console.error(error);
  }
};
