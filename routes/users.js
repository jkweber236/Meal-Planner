const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const requiresAuth = require('../middleware/requiresAuth');

// Get all users
router.get('/', requiresAuth(), (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Retrieve all users'
  usersController.getAllUsers(req, res);
});

// Get a user by ID
router.get('/:id', requiresAuth(), (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Retrieve a user by ID'
  // #swagger.parameters['id'] = { description: 'User ID' }
  usersController.getUser(req, res);
});

// Get a user's favorites
router.get('/:id/favorites', requiresAuth(), (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = "Retrieve a user's favorites"
  usersController.getFavorites(req, res);
});

// Create a new user
router.post('/', requiresAuth(), (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Create a new user'
  usersController.createUser(req, res);
});

// Add a favorite for a user
router.post('/:id/favorites/:recipeID', requiresAuth(), (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Add a favorite for a user'
  usersController.addFavorite(req, res);
});

// Update a user by ID
router.put('/:id', requiresAuth(), (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Update a user by ID'
  usersController.updateUser(req, res);
});

// Delete a user by ID
router.delete('/:id', requiresAuth(), (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Delete a user by ID'
  usersController.deleteUser(req, res);
});

// Remove a favorite recipe for a user
router.delete('/:id/favorite/:recipeID', requiresAuth(), (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Remove a favorite recipe for a user'
  usersController.removeFavorite(req, res);
});

module.exports = router;
