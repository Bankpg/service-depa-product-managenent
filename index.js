import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dbConfig from "./database/db.js";
import productRoute from "./routes/product.route.js";
import orderRoute from "./routes/order.route.js";

const app = express();
const PORT = process.env.PORT || 4000;
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, { useNewUrlParser: true }).then(
  () => {
    console.log("Connected to the database");
  },
  (error) => {
    console.error("Could not connect to the database: ", error);
  }
);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//กำหนด route
app.use("/products", productRoute);
app.use("/orders", orderRoute);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
