const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/mealPlan');
const requiresAuth = require('../middleware/requiresAuth');
const validator = require('../middleware/validateMealPlan');

// Get a meal plan by ID
router.get('/:id', validator.validateID, (req, res) => {
  // #swagger.tags = ['Meal Plans']
  // #swagger.summary = 'Retrieve a meal plan by ID'
  // #swagger.parameters['id'] = { description: 'Meal Plan ID' }
  mealPlanController.getMealPlan(req, res);
});

// Create a new meal plan
router.post('/', validator.saveMealPlan, requiresAuth(), (req, res) => {
  // #swagger.tags = ['Meal Plans']
  // #swagger.summary = 'Create a new meal plan'
  mealPlanController.createMealPlan(req, res);
});

// Update a meal plan by ID
router.put('/:id', validator.validateID, validator.saveMealPlan, requiresAuth(), (req, res) => {
  // #swagger.tags = ['Meal Plans']
  // #swagger.summary = 'Update a meal plan by ID'
  // #swagger.parameters['id'] = { description: 'Meal Plan ID' }
  mealPlanController.updateMealPlan(req, res);
});

// Delete a meal plan by ID
router.delete('/:id', validator.validateID, requiresAuth(), (req, res) => {
  // #swagger.tags = ['Meal Plans']
  // #swagger.summary = 'Delete a meal plan by ID'
  // #swagger.parameters['id'] = { description: 'Meal Plan ID' }
  mealPlanController.deleteMealPlan(req, res);
});

module.exports = router;
