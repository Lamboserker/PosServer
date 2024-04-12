import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
const app = express();

//Middleware
app.use(bodyParser.json());
app.use(cors());
connectDB();

// Routen verwenden
app.use("/api/users", userRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/items", itemRoutes);

// bodyParser Middleware für URL-encoded Daten
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
