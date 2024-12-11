const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipes');
const requiresAuth = require('../middleware/requiresAuth');
const validator = require('../middleware/validateRecipe');

// Get all recipes
router.get('/', validator.limitGetAll, (req, res) => {
  // #swagger.tags = ['Recipes']
  // #swagger.summary = 'Retrieve all recipes'
  recipesController.getAllRecipes(req, res);
});

// Get a recipe by ID
router.get('/:id', validator.validateID, (req, res) => {
  // #swagger.tags = ['Recipes']
  // #swagger.summary = 'Retrieve a recipe by ID'
  // #swagger.parameters['id'] = { description: 'Recipe ID' }
  recipesController.getRecipe(req, res);
});

// Create a new recipe
router.post('/:userid', validator.validateID, validator.saveRecipe, requiresAuth(), (req, res) => {
  // #swagger.tags = ['Recipes']
  // #swagger.summary = 'Create a new recipe'
  recipesController.createRecipe(req, res);
});

// Update a recipe by ID
router.put('/:id', validator.validateID, validator.saveRecipe, requiresAuth(), (req, res) => {
  // #swagger.tags = ['Recipes']
  // #swagger.summary = 'Update a recipe by ID'
  // #swagger.parameters['id'] = { description: 'Recipe ID' }
  recipesController.updateRecipe(req, res);
});

// Delete a recipe by ID
router.delete('/:id', validator.validateID, requiresAuth(), (req, res) => {
  // #swagger.tags = ['Recipes']
  // #swagger.summary = 'Delete a recipe by ID'
  // #swagger.parameters['id'] = { description: 'Recipe ID' }
  recipesController.deleteRecipe(req, res);
});

module.exports = router;
