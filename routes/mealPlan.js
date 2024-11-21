const express = require('express');
const router = express.Router();

const mealPlanController = require('../controllers/mealPlan');

router.get('/:id', mealPlanController.getmealPlan);
router.post('/', mealPlanController.createmealPlan);
router.put('/:id', mealPlanController.updatemealPlan);
router.delete('/:id', mealPlanController.deletemealPlan);

module.exports = router;