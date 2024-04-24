import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Funktion zum Senden von Bestätigungs-E-Mails
const sendConfirmationEmail = async (name, email, confirmationCode) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "lukaslamberz96@gmail.com",
      pass: "fppx ldar bjdt danq",
    },
  });

  const mailOptions = {
    from: "lukaslamberz96@gmail.com",
    to: "lukaslamberz96@gmail.com",
    subject: "Jimmys-Cocktails: Bitte bestätige deine E-Mail-Adresse",
    html: `<h1>E-Mail Bestätigung</h1>
           <h2>Hallo ${name}</h2>
           <p>Danke, dass du dich registriert hast. Bitte bestätige deine E-Mail durch Eingabe des folgenden Codes in der App: <strong>${confirmationCode}</strong></p>`,
  };

  await transporter.sendMail(mailOptions);
};

// Funktion zum Verifizieren der E-Mail
export const verifyEmail = async (req, res) => {
  const { code: confirmationCode } = req.body;

  if (!confirmationCode) {
    return res
      .status(400)
      .json({ message: "Kein Bestätigungscode bereitgestellt." });
  }

  try {
    const decoded = jwt.verify(confirmationCode, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      email: decoded.email,
      status: "Pending",
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Benutzer nicht gefunden oder Code ungültig." });
    }

    user.status = "Active";
    await user.save();

    res.status(200).json({ message: "E-Mail erfolgreich verifiziert." });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(410).json({ message: "Bestätigungscode abgelaufen." });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: "Ungültiger Bestätigungscode." });
    } else {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Serverfehler beim Verifizieren des Codes." });
    }
  }
};

// Benutzer registrieren
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Benutzer existiert bereits." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Erstelle einen Benutzer ohne ihn zu speichern
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "employee",
      status: "Pending",
    });

    // Verschlüssel die Benutzer-ID und E-Mail in einem JWT als Bestätigungscode
    const confirmationCode = jwt.sign(
      { email: user.email, id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Gültig für 1 Tag
    );

    user.confirmationCode = confirmationCode;
    await user.save();

    sendConfirmationEmail(name, email, confirmationCode);

    res.status(201).json({
      message:
        "Benutzer registriert. Bitte überprüfe deine E-Mail zur Bestätigung.",
    });
  } catch (error) {
    res.status(500).json({ message: "Etwas ist schiefgelaufen." });
    console.error(error);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden." });
    }

    if (user.status !== "Active") {
      return res
        .status(401)
        .json({ message: "Bitte bestätige zuerst deine E-Mail-Adresse." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Ungültiges Passwort." });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: user, token });
  } catch (error) {
    res.status(500).json({ message: "Etwas ist schiefgelaufen." });
    console.error(error);
  }
};
