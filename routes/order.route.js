import express from "express";
import Order from "../models/order.js";
import Product from "../models/product.js";

const router = express.Router();

//get
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("products.product");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "products.product"
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new order
router.post("/createOrder", async (req, res) => {
  try {
    const { customerName, phoneNumber, address, codService, products } =
      req.body;

    let total = 0;

    // Validate that all products exist and calculate the total price
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient quantity for product ${product.productName}`,
        });
      }
      total += product.price * item.quantity;
    }

    // Create the order
    const order = new Order({
      customerName,
      phoneNumber,
      address,
      codService,
      products,
      total,
    });
    await order.save();

    // Decrease the product quantities
    for (const item of products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity },
      });
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an order by ID
router.delete("/deleteOrder/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Restore product quantities
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: item.quantity },
      });
    }

    // Delete the order
    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/updateOrder/:id", async (req, res) => {
  try {
    const { customerName, phoneNumber, address, codService, products } =
      req.body;

    // Find the existing order
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Restore previous product quantities
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: item.quantity },
      });
    }

    let total = 0;

    // Validate that new products exist and calculate the total price
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient quantity for product ${product.productName}`,
        });
      }
      total += product.price * item.quantity;
    }

    // Update the order details
    order.customerName = customerName;
    order.phoneNumber = phoneNumber;
    order.address = address;
    order.codService = codService;
    order.products = products;
    order.total = total;

    // Save the updated order
    await order.save();

    // Adjust the product quantities based on the updated order
    for (const item of products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity },
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
