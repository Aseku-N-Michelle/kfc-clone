const { Router } = require("express");
const Cart = require("../model/cartSchema");
const cartRouter = Router();

// CREATE
cartRouter.post("/cart", async (req, res) => {
  try {
    await Cart.insertMany(req.body);
    return res.status(201).send("cart added");
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// READ
cartRouter.get("/cart", async (req, res) => {
  try {
    let cart = await Cart.find();
    return res.json(cart);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE
cartRouter.delete("/cart/:id", async (req, res) => {
  try {
    await Cart.deleteOne(req.params);
    res.send("delete successful");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
cartRouter.put("/cart/:id", async (req, res) => {
  try {
    if (req.body.qty === 0) {
      await Cart.deleteOne(req.params);
      return res.send("cart is empty");
    }
    await Cart.updateOne(req.params, { $set: req.body });
    let cart = await Cart.find(req.params);
    return res.json(cart);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = cartRouter;