import fs from "fs";
import path from "path";
import { connectDB } from "./config/db.js"; // Stelle sicher, dass die connectDB-Funktion richtig exportiert wird
import User from "./models/User.js"; // Annahme: Datei und Modell für User existieren
import Sale from "./models/Sale.js"; // Annahme: Datei und Modell für Sale existieren

// Verbinde dich mit der MongoDB-Datenbank
connectDB();

// Funktion zum Abrufen aller Benutzer und Verkäufe aus der MongoDB-Datenbank
const fetchAllDataFromDB = async () => {
  try {
    const users = await User.find();
    const sales = await Sale.find();
    return { users, sales };
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten aus der Datenbank:", error);
    throw error;
  }
};

// Funktion zum Speichern der Daten in einer JSON-Datei auf deinem PC
const saveDataLocally = (data) => {
  try {
    const dataDir = path.join(__dirname, "data"); // Pfad zum Verzeichnis 'data'
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true }); // Verzeichnis erstellen, falls nicht vorhanden
    }
    const filePath = path.join(dataDir, "mongodb_data.json"); // Pfad zum Speichern der Daten
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); // Daten als JSON speichern
    console.log("Daten erfolgreich lokal gespeichert.");
  } catch (error) {
    console.error("Fehler beim Speichern der Daten:", error);
  }
};

// Funktion zum Abrufen aller Daten aus der Datenbank und Speichern auf dem PC
const fetchDataAndSaveLocally = async () => {
  try {
    const allData = await fetchAllDataFromDB();
    saveDataLocally(allData);
  } catch (error) {
    console.error("Fehler beim Abrufen und Speichern der Daten:", error);
  }
};

// Zeitplanung für das regelmäßige Ausführen der Funktion
const intervalInMilliseconds = 24 * 60 * 60 * 1000; // 24 Stunden
setInterval(fetchDataAndSaveLocally, intervalInMilliseconds); // Führe die Funktion alle 24 Stunden aus

// Initialer Aufruf zum ersten Mal ausführen
fetchDataAndSaveLocally();
