import mongoose from "mongoose";
import Sale from "./models/Sale.js";

const testQuery = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const productQuery = "660818fe054d3fb5082e33a0";
  const startDate = new Date("2024-01-01");
  const endDate = new Date("2024-12-31");
  endDate.setHours(23, 59, 59, 999);

  const query = {
    product: productQuery,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  const sales = await Sale.find(query).populate("user").populate("product");
  console.log("Fetched sales:", sales);

  await mongoose.disconnect();
};

testQuery().catch((error) => console.error("Error:", error));
