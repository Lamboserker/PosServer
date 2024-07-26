import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Nicht autorisiert, Benutzer nicht gefunden" });
      }

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
    next();
  } else {
    return res.status(401).json({ message: "Nicht autorisiert als Admin" });
  }
};
