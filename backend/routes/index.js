const express = require(`express`);
const router = express.Router();
const itemController = require(`../controllers/itemController`);

router.get(`/items`, itemController.getAllItems);

router.post(`/items`, itemController.createItem);

router.get(`/items:id`, itemController.getItemById);

router.put(`/items:id`, itemController.updateItemByID);

router.delete(`/items:id`, itemController.deleteItemById);

module.exports = router;
