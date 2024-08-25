import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  customerName: { type: String, required: true, max: 100 },
  phoneNumber: { type: String, required: true, max: 15 },
  address: { type: String, required: true, max: 255 },
  codService: { type: Boolean, required: true },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  total: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;
