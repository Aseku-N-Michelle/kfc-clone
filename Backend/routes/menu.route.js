const { Router } = require("express");
const Menu = require("../model/menuSchema");
const menuRouter = Router();

// READ all (or filtered by ?type=snacks)
menuRouter.get("/menu", async (req, res) => {
  let query = req.query;
  let items = await Menu.find(query);
  res.json(items);
});

// READ one
menuRouter.get("/menu/:id", async (req, res) => {
  let { id } = req.params;
  let only = await Menu.find({ _id: id });
  return res.json(only);
});

// CREATE
menuRouter.post("/menu", async (req, res) => {
  try {
    const item = await Menu.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE
menuRouter.put("/menu/:id", async (req, res) => {
  try {
    const item = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
menuRouter.delete("/menu/:id", async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = menuRouter;