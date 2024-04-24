// saleController.js
import Sale from "../models/Sale.js";

// Verkauf erfassen
export const recordSale = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Nicht autorisiert" });
  }

  const { userId, productId, count, amount } = req.body;
  if (!req.user) {
    return res.status(401).json({ message: "Nicht autorisiert" });
  }

  const { userId, productId, count, amount } = req.body;

  try {
    const newSale = await Sale.create({
      user: userId,
      product: productId,
      count,
      amount,
      date: new Date(),
      date: new Date(),
    });

    res.status(201).json(newSale);
  } catch (error) {
    res.status(500).json({
      message: "Etwas ist schiefgelaufen beim Erfassen des Verkaufs.",
      error: error.message,
    });
  }
};

// Verkauf abrufen
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.saleId).populate("product");
    if (!sale) {
      return res.status(404).json({ message: "Verkauf nicht gefunden" });
    }
    res.status(200).json(sale);
  } catch (error) {
    console.error("Fehler beim Abrufen des Verkaufs:", error);
    res.status(500).json({ message: "Serverfehler beim Abrufen des Verkaufs" });
  }
};

//Alle Verkäufe eines users
export const getAllSalesByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const sales = await Sale.find({ user: userId }).populate("product");
    if (!sales) {
      return res
        .status(404)
        .json({ message: "Keine Verkäufe für diesen Benutzer gefunden" });
    }
    res.status(200).json(sales);
  } catch (error) {
    console.error("Fehler beim Abrufen der Verkäufe des Benutzers:", error);
    res
      .status(500)
      .json({
        message: "Serverfehler beim Abrufen der Verkäufe des Benutzers",
      });
  }
};
