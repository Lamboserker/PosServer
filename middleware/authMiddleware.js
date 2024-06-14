// In authMiddleware.js
import jwt from "jsonwebtoken"; // Importieren Sie die jwt-Bibliothek
import User from "../models/User.js"; // Importieren Sie das Modell "User" aus der Datei "User.js"
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findOne({ name: decoded.name }).select("-password"); // Suche nach dem Benutzer mit dem decodierten Namen
      console.log("Found user:", req.user); // Logge den gefundenen Benutzer
      next();
    } catch (error) {
      console.error("Token-Verifikation fehlgeschlagen:", error);
      return res
        .status(401)
        .json({ message: "Nicht autorisiert, Token fehlgeschlagen" });
    }
  } else {
    return res.status(401).json({ message: "Nicht autorisiert, kein Token" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    console.log("User role:", req.user.role); // Logge die Rolle des Benutzers
    next();
  } else {
    return res.status(401).json({ message: "Nicht autorisiert als Admin" });
  }
};
