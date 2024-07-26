import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(compression());
app.use(morgan("combined"));

// Verbindung zur Datenbank herstellen
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/items", itemRoutes);

// Fehlerbehandlungs-Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
