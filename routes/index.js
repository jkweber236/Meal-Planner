const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/user', require('./user'));
router.use('/recipe', require('./recipe'));
router.use('/meal-plan', require('./mealPlan'));
router.use('/grocery-list', require('./groceryList'));

module.exports = router;
