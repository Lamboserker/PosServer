import Item from "../models/Items.js";

// Funktion zum Hinzufügen eines neuen Artikels
export const addItem = async (req, res) => {
  // Extrahieren von Daten aus dem req.body, einschließlich der neuen Felder
  const { name, type, price, image } = req.body;

  try {
    // Artikel in der Datenbank erstellen, einschließlich der neuen Felder
    const newItem = await Item.create({
      name,
      type, // Hinzugefügt
      price,
      image, // Optional, kann leer sein, falls nicht angegeben
      // Weitere Felder hinzufügen, falls erforderlich
    });

    // Erfolgreiche Antwort senden
    res.status(201).json(newItem);
  } catch (error) {
    // Fehler behandeln
    console.error("Fehler beim Hinzufügen des Artikels: ", error);
    res
      .status(500)
      .json({ message: "Serverfehler beim Hinzufügen des Artikels" });
  }
};

// Funktion zum Abrufen aller verfügbaren Artikel
export const getItems = async (req, res) => {
  try {
    // Alle Artikel aus der Datenbank abrufen
    const items = await Item.find();

    // Erfolgreiche Antwort senden
    res.status(200).json(items);
  } catch (error) {
    // Fehler behandeln
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
