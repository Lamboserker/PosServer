// saleController.js
import Sale from "../models/Sale.js";

// Verkauf erfassen
export const recordSale = async (req, res) => {
  const { userId, productId, count, amount } = req.body; // Include `amount` here

  try {
    const newSale = await Sale.create({
      user: userId,
      product: productId,
      date: new Date(),
      count,
      amount,
    });

    res.status(201).json(newSale);
  } catch (error) {
    res.status(500).json({
      message: "Etwas ist schiefgelaufen beim Erfassen des Verkaufs.",
    });
    console.log(error);
  }
};
