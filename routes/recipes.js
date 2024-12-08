const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipes');
const requiresAuth = require('../middleware/requiresAuth');

// Get all recipes
router.get('/', (req, res) => {
  // #swagger.tags = ['Recipes']
  // #swagger.summary = 'Retrieve all recipes'
  recipesController.getAllRecipes(req, res);
});

// Get a recipe by ID
router.get('/:id', (req, res) => {
  // #swagger.tags = ['Recipes']
  // #swagger.summary = 'Retrieve a recipe by ID'
  // #swagger.parameters['id'] = { description: 'Recipe ID' }
  recipesController.getRecipe(req, res);
});

// Create a new recipe
router.post('/:userid', requiresAuth(), (req, res) => {
  // #swagger.tags = ['Recipes']
  // #swagger.summary = 'Create a new recipe'
  recipesController.createRecipe(req, res);
});

// Update a recipe by ID
router.put('/:id', requiresAuth(), (req, res) => {
  // #swagger.tags = ['Recipes']
  // #swagger.summary = 'Update a recipe by ID'
  // #swagger.parameters['id'] = { description: 'Recipe ID' }
  recipesController.updateRecipe(req, res);
});

// Delete a recipe by ID
router.delete('/:id', requiresAuth(), (req, res) => {
  // #swagger.tags = ['Recipes']
  // #swagger.summary = 'Delete a recipe by ID'
  // #swagger.parameters['id'] = { description: 'Recipe ID' }
  recipesController.deleteRecipe(req, res);
});

module.exports = router;
