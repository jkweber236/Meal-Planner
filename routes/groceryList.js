const express = require('express');
const router = express.Router();

const groceryListController = require('../controllers/groceryList');

router.get('/:id', groceryListController.getGroceryList);
router.post('/', groceryListController.createGroceryList);
router.put('/:id', groceryListController.updateGroceryList);
router.delete('/:id', groceryListController.deleteGroceryList);

module.exports = router;