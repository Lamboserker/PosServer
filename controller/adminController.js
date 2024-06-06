import Sale from "../models/Sale.js";

// Verkaufsdaten abrufen mit Filter für das Produkt
export const getSales = async (req, res) => {
  const productQuery = req.query.product; // Produkt-ID aus den Query-Parametern

  try {
    let query = {};

    // Wenn ein Produkt angegeben ist, filtere die Verkäufe nach diesem Produkt
    if (productQuery) {
      query.product = productQuery;
    }

    const sales = await Sale.find(query).populate("user").populate("product");

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({
      message: "Etwas ist schiefgelaufen beim Abrufen der Verkaufsdaten.",
    });
    console.log(error);
  }
};
