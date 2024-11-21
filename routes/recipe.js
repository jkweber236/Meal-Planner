const express = require('express');
const router = express.Router();

const recipesController = require('../controllers/recipe');

router.get('/', recipesController.getAllRecipes);
router.get('/:id', recipesController.getRecipe);
router.post('/', recipesController.createRecipe);
router.put('/:id', recipesController.updateRecipe);
router.delete('/:id', recipesController.deleteRecipe);

module.exports = router;