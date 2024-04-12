import mongoose from "mongoose";

const saleSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Referenz auf das User Model
    },
    product: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now, // Standardmäßig das aktuelle Datum und die aktuelle Uhrzeit
    },
    count: {
      // Hinzufügen des Betragsfeldes
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
