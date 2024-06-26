const Item = require(`../models/itemModel`);

const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    if (!items) return res.status(404).send(`Items not found`);
    res.status(201).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createItem = async (req, res) => {
  try {
    const item = new Item(req.body);
    const newItem = item.save();
    res.status(200).json(newItem);
  } catch (error) {}
};
module.exports = {
  getAllItems,
  createItem,
  getItemById,
  updateItemByID,
  deleteItemById,
};
