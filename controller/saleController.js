// saleController.js
import Sale from "../models/Sale.js";

// Verkauf erfassen
export const recordSale = async (req, res) => {
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
    });

    res.status(201).json(newSale);
  } catch (error) {
    res.status(500).json({
      message: "Etwas ist schiefgelaufen beim Erfassen des Verkaufs.",
      error: error.message
    });
  }
};
