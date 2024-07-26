import Sale from "../models/Sale.js";

// Verkaufsdaten abrufen mit Filter für das Produkt und Datum
export const getSales = async (req, res) => {
  const { product } = req.query; // Assuming product comes from query params

  let query = {};
  if (product) {
    query.product = product; // Only add product to query if it's defined
  }

  try {
    const sales = await Sale.find(query);
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Server error fetching sales" });
  }
};
