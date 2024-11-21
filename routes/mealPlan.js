const express = require('express');
const router = express.Router();

const mealPlanController = require('../controllers/mealPlan');

router.get('/:id', mealPlanController.getMealPlan);
router.post('/', mealPlanController.createMealPlan);
router.put('/:id', mealPlanController.updateMealPlan);
router.delete('/:id', mealPlanController.deleteMealPlan);

module.exports = router;