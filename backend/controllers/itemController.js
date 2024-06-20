const Item = require(`../models/itemModel`);

const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).jason({ message: error.message });
  }
};

const createItem = async (req, res) => {
  const item = new Item(req.body);
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getItemById = async (req, res) => {
  try {
  } catch (error) {}
};

const updateItemByID = (req, res) => {};

const deleteItemById = (req, res) => {};

module.exports = {
  getAllItems,
  createItem,
  getItemById,
  updateItemByID,
  deleteItemById,
};
