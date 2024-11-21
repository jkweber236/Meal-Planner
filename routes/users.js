const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');

router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUser);
router.get('/:id/favorites', usersController.getFavorites);
router.post('/', usersController.createUser);
router.post('/:id/favorites', usersController.addFavorite);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);
router.delete('/:id/favorite/:recipeID', usersController.removeFavorite);

module.exports = router;