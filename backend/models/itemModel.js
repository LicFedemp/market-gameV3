const { default: mongoose } = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

const Item = mongoose.model("item", itemSchema);

module.exports = Item;
