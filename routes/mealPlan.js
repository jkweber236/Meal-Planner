const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/mealPlan');

// Get a meal plan by ID
router.get('/:id', (req, res) => {
  // #swagger.tags = ['Meal Plans']
  // #swagger.summary = 'Retrieve a meal plan by ID'
  // #swagger.parameters['id'] = { description: 'Meal Plan ID' }
  mealPlanController.getMealPlan(req, res);
});

// Create a new meal plan
router.post('/', (req, res) => {
  // #swagger.tags = ['Meal Plans']
  // #swagger.summary = 'Create a new meal plan'
  mealPlanController.createMealPlan(req, res);
});

// Update a meal plan by ID
router.put('/:id', (req, res) => {
  // #swagger.tags = ['Meal Plans']
  // #swagger.summary = 'Update a meal plan by ID'
  // #swagger.parameters['id'] = { description: 'Meal Plan ID' }
  mealPlanController.updateMealPlan(req, res);
});

// Delete a meal plan by ID
router.delete('/:id', (req, res) => {
  // #swagger.tags = ['Meal Plans']
  // #swagger.summary = 'Delete a meal plan by ID'
  // #swagger.parameters['id'] = { description: 'Meal Plan ID' }
  mealPlanController.deleteMealPlan(req, res);
});

module.exports = router;
