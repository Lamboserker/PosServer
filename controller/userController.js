import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Benutzer registrieren
export const registerUser = async (req, res) => {
  const { name, password, role } = req.body;

  try {
    // Prüfe, ob der Benutzer bereits existiert
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: "Benutzer existiert bereits." });
    }

    // Hash das Passwort
    const hashedPassword = await bcrypt.hash(password, 12);

    // Definiere die Benutzerrolle
    // Sicherheitshinweis: In der Praxis sollte das direkte Setzen einer Admin-Rolle über eine öffentliche API vermieden werden.
    // Dieses Beispiel setzt voraus, dass angemessene Sicherheitsmaßnahmen getroffen wurden.
    let userRole = "employee";
    if (role && ["admin", "employee"].includes(role)) {
      userRole = role;
    }

    // Erstelle einen neuen Benutzer mit der Rolle
    const result = await User.create({
      password: hashedPassword,
      name,
      role: userRole,
    });

    // Erstelle einen JWT-Token
    const token = jwt.sign(
      { id: result._id, role: result.role },
      "test", // Denk daran, einen sicheren Schlüssel zu verwenden und ihn nicht hart zu kodieren
      { expiresIn: "1h" }
    );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Etwas ist schiefgelaufen." });
    console.log(error);
  }
};

export const loginUser = async (req, res) => {
  const { password } = req.body;
  let { name } = req.body;

  try {
    let user;
    // Bestimmen, ob die Eingabe eine E-Mail-Adresse oder ein Benutzername ist und entsprechend suchen

    if (!name) {
      return res.status(400).json({ message: " Benutzername fehlt." });
    } else {
      user = await User.findOne({ name });
    }
    // Wenn kein Benutzer gefunden wurde
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
      { id: user._id },
      process.env.JWT_SECRET, // Verwende eine Umgebungsvariable für den JWT-Secret
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: user, token, status: user.role }); // Senden Sie den Benutzerstatus als Teil der Antwort
  } catch (error) {
    res.status(500).json({ message: "Etwas ist schiefgelaufen." });
    console.error(error);
  }
};
