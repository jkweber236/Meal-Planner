const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/users', require('./users'));
router.use('/recipes', require('./recipes'));
router.use('/meal-plan', require('./mealPlan'));
router.use('/grocery-list', require('./groceryList'));

module.exports = router;
