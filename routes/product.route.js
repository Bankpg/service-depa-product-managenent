import express from "express";
import Product from "../models/product.js";

const router = express.Router();

router.route("/").get(async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.route("/createProduct").post(async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    console.log(newProduct);
    res.json(newProduct);
  } catch (error) {
    next(error);
  }
});

router.route("/updateProduct/:id").put(async (req, res, next) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updateProduct);
  } catch (error) {
    next(error);
  }
});

router.route("/deleteProduct/:id").delete(async (req, res, next) => {
  try {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    // res.json(deleteProduct);
    res.status(200).json({ msg: deleteProduct });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});
export default router;
