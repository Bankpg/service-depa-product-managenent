import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  productId: { type: String, required: true, max: 20 },
  productName: { type: String, required: true, max: 100 },
  price: { type: Number, required: true, max: 10000 },
  quantity: { type: Number, required: true, max: 10000 },
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
