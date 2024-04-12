import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["aLcoholicDrinks", "nonAlcohol", "rest", "Pfand"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  // Weitere Felder, die du hinzufügen möchtest
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
