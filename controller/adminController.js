import Sale from "../models/Sale.js";

// Verkaufsdaten abrufen mit Filter für das Produkt und Datum
export const getSales = async (req, res) => {
  const productQuery = req.query.product;
  const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
  const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

  try {
    let query = {};

    if (productQuery) {
      query.product = productQuery;
    }

    if (startDate && endDate) {
      endDate.setHours(23, 59, 59, 999);
      query.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    console.log("Constructed query:", query);

    const sales = await Sale.find(query).populate("user").populate("product");

    console.log("Fetched sales:", sales);

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({
      message: "Etwas ist schiefgelaufen beim Abrufen der Verkaufsdaten.",
    });
    console.log(error);
  }
};
