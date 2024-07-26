import Sale from "../models/Sale.js";
import Item from "../models/Items.js";
import { check, validationResult } from "express-validator";
import mongoose from "mongoose";

// Verkauf erfassen
export const recordSale = [
  // Validation
  check("userId", "Benutzer-ID ist erforderlich").not().isEmpty(),
  check("productId", "Produkt-ID ist erforderlich").exists(), // Ensure productId exists
  check("count", "Anzahl muss eine Zahl sein").isNumeric(),
  check("amount", "Betrag muss eine Zahl sein").isNumeric(),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Nicht autorisiert" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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
        error: error.message,
      });
    }
  },
];

// // Verkauf abrufen
// export const getSaleById = async (req, res) => {
//   try {
//     const saleId = req.params.saleId;

//     if (!mongoose.isValidObjectId(saleId)) {
//       return res.status(400).json({ message: "Ungültige saleId" });
//     }

//     const sale = await Sale.findById(saleId).populate("product");
//     if (!sale) {
//       return res.status(404).json({ message: "Verkauf nicht gefunden" });
//     }

//     res.status(200).json(sale);
//   } catch (error) {
//     console.error("Fehler beim Abrufen des Verkaufs:", error);
//     res.status(500).json({ message: "Serverfehler beim Abrufen des Verkaufs" });
//   }
// };

// Alle Verkäufe eines Benutzers abrufen
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
    res.status(500).json({
      message: "Serverfehler beim Abrufen der Verkäufe des Benutzers",
    });
  }
};

// Funktion zum Suchen von Verkäufen basierend auf Startdatum, Enddatum und ausgewählten Artikeln
export const searchSales = async (req, res) => {
  const { startDate, endDate, items } = req.body;

  try {
    let query = {
      date: { $gte: startDate, $lte: endDate }, // Verkaufsdatum zwischen startDate und endDate
    };

    if (items.length > 0) {
      query.product = { $in: items }; // Wenn items nicht leer ist, filtere nach ausgewählten items
    }

    // Überprüfe, ob items ein leeres Array ist, um alle Produkte abzurufen
    const sales = await Sale.find(query).populate("product");

    res.status(200).json(sales);
  } catch (error) {
    console.error("Fehler beim Suchen von Verkäufen:", error);
    res.status(500).json({ message: "Serverfehler beim Suchen von Verkäufen" });
  }
};

// Funktion zur Abruf der Gesamtanzahl der Verkäufe
export const getSalesCount = async (req, res) => {
  try {
    const totalSales = await Sale.countDocuments();
    res.json({ count: totalSales });
  } catch (error) {
    console.error("Fehler beim Abrufen der Gesamtanzahl der Verkäufe:", error);
    res.status(500).json({ message: "Serverfehler" });
  }
};

export const getItemSalesData = async (req, res) => {
  try {
    // Gesamtanzahl der Verkäufe aller Items abrufen
    const totalSales = await Sale.countDocuments();

    // Verkaufsdaten nach Items abrufen und verarbeiten
    const itemSales = await Sale.aggregate([
      {
        $group: {
          _id: "$product",
          totalAmount: { $sum: "$count" },
        },
      },
      {
        $lookup: {
          from: "items",
          localField: "_id",
          foreignField: "_id",
          as: "item",
        },
      },
      {
        $project: {
          id: { $arrayElemAt: ["$_id", 0] },
          value: "$totalAmount",
          label: { $arrayElemAt: ["$item.name", 0] },
        },
      },
    ]);

    // Berechnung der prozentualen Anteile der Items
    const data = itemSales.map((item) => ({
      id: item.id.toString(),
      value: item.value,
      label: item.label,
      percentage: ((item.value / totalSales) * 100).toFixed(2),
    }));

    // Formatieren der Antwort im angegebenen Format
    const formattedData = data.map((item, index) => ({
      id: index,
      value: parseInt(item.percentage) || 0,
      label: item.label,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Fehler beim Abrufen der Verkaufsdaten der Items:", error);
    res.status(500).json({ message: "Serverfehler" });
  }
};

// Controller-Funktion im saleController.js
export const totalSalesByItem = async (req, res) => {
  try {
    // Zuerst alle Items abrufen
    const items = await Item.find();
    // Ergebnisse vorbereiten
    const results = await Promise.all(
      items.map(async (item) => {
        const salesData = await Sale.aggregate([
          { $match: { product: item._id } }, // Filtert Verkäufe nach dem aktuellen Item
          {
            $group: {
              _id: "$product",
              totalSalesAmount: { $sum: "$amount" },
            },
          },
          {
            $project: {
              item: item.name,
              totalSales: "$totalSalesAmount",
            },
          },
        ]);
        return salesData[0]
          ? { ...salesData[0], item: item.name }
          : { item: item.name, totalSales: 0 };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("Error retrieving total sales by item:", error);
    res.status(500).json({ message: "Server error retrieving sales data" });
  }
};

// Funktion zum Löschen eines Verkaufs nach ID
export const deleteSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Verkauf nicht gefunden" });
    }

    await Sale.deleteOne({ _id: req.params.id }); // Verkauf löschen
    res.status(200).json({ message: "Verkauf erfolgreich gelöscht" });
  } catch (error) {
    console.error("Fehler beim Löschen des Verkaufs:", error);
    res.status(500).json({ message: "Serverfehler beim Löschen des Verkaufs" });
  }
};

export const filterSalesByUsers = async (req, res) => {
  const { userIds } = req.body;

  try {
    const sales = await Sale.find({ user: { $in: userIds } }).populate(
      "product"
    );
    if (!sales.length) {
      return res.status(404).json({
        message: "Keine Verkäufe für die ausgewählten Benutzer gefunden",
      });
    }
    res.status(200).json(sales);
  } catch (error) {
    console.error("Fehler beim Filtern der Verkäufe nach Benutzern:", error);
    res.status(500).json({
      message: "Serverfehler beim Filtern der Verkäufe nach Benutzern",
    });
  }
};

export const getSalesPercentageByUsers = async (req, res) => {
  const { userIds, startDate, endDate } = req.body;

  try {
    let query = { user: { $in: userIds } };

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const totalSales = await Sale.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const userSales = await Sale.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$user",
          userAmount: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          user: { $arrayElemAt: ["$user.name", 0] },
          userAmount: 1,
        },
      },
    ]);

    const totalAmount = totalSales[0] ? totalSales[0].totalAmount : 0;
    const percentageData = userSales.map((userSale) => ({
      user: userSale.user,
      percentage: ((userSale.userAmount / totalAmount) * 100).toFixed(2),
    }));

    res.status(200).json(percentageData);
  } catch (error) {
    console.error(
      "Fehler beim Abrufen des prozentualen Anteils der Verkäufe nach Benutzern:",
      error
    );
    res
      .status(500)
      .json({ message: "Serverfehler beim Abrufen der Verkaufsdaten" });
  }
};
