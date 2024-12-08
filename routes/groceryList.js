const express = require('express');
const router = express.Router();
const groceryListController = require('../controllers/groceryList');
const requiresAuth = require('../middleware/requiresAuth');

// Get a grocery list by ID
router.get('/:id', (req, res) => {
  // #swagger.tags = ['Grocery Lists']
  // #swagger.summary = 'Retrieve a grocery list by ID'
  // #swagger.parameters['id'] = { description: 'Grocery List ID' }
  groceryListController.getGroceryList(req, res);
});

// Create a new grocery list
router.post('/', requiresAuth(), (req, res) => {
  // #swagger.tags = ['Grocery Lists']
  // #swagger.summary = 'Create a new grocery list'
  groceryListController.createGroceryList(req, res);
});

// Update a grocery list by ID
router.put('/:id', requiresAuth(), (req, res) => {
  // #swagger.tags = ['Grocery Lists']
  // #swagger.summary = 'Update a grocery list by ID'
  // #swagger.parameters['id'] = { description: 'Grocery List ID' }
  groceryListController.updateGroceryList(req, res);
});

// Delete a grocery list by ID
router.delete('/:id', requiresAuth(), (req, res) => {
  // #swagger.tags = ['Grocery Lists']
  // #swagger.summary = 'Delete a grocery list by ID'
  // #swagger.parameters['id'] = { description: 'Grocery List ID' }
  groceryListController.deleteGroceryList(req, res);
});

module.exports = router;
