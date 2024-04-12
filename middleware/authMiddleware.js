import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extrahiere den Token aus dem Authorization-Header
      token = req.headers.authorization.split(" ")[1];

      // Verifiziere den Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Hole den Benutzer von der Datenbank ohne das Passwort
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res
        .status(401)
        .json({ message: "Nicht autorisiert, Token fehlgeschlagen" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Nicht autorisiert, kein Token" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Nicht autorisiert als Admin" });
  }
};
