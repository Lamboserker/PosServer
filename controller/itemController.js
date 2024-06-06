import Item from "../models/Items.js";
import { check, validationResult } from "express-validator";

// Funktion zum Hinzufügen eines neuen Artikels
export const addItem = [
  // Validierung
  check("name", "Name ist erforderlich").not().isEmpty(),
  check("type", "Ungültiger Typ").isIn([
    "alcoholicDrinks",
    "nonAlcohol",
    "rest",
    "Pfand",
  ]),
  check("price", "Preis muss eine Zahl sein").isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, type, price, image } = req.body;

    try {
      const newItem = await Item.create({
        name,
        type,
        price,
        image,
      });

      res.status(201).json(newItem);
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Artikels: ", error);
      res
        .status(500)
        .json({ message: "Serverfehler beim Hinzufügen des Artikels" });
    }
  },
];
// Funktion zum Abrufen aller verfügbaren Artikel
export const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    console.error("Fehler beim Abrufen der Artikel: ", error);
    res.status(500).json({ message: "Serverfehler beim Abrufen der Artikel" });
  }
};

export const addPfandToOrder = async (req, res) => {
  const orderId = req.body.orderId; // Die ID der Bestellung aus dem Request bekommen
  try {
    // Hier Logik einfügen, um die Bestellung zu finden und zu aktualisieren
    const order = await Order.findById(orderId);
    order.total += 3; // 3€ zum Gesamtbetrag hinzufügen
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.error("Fehler beim Hinzufügen von Pfand zur Bestellung: ", error);
    res
      .status(500)
      .json({ message: "Serverfehler beim Aktualisieren der Bestellung" });
  }
};
