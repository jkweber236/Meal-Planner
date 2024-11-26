const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllUsers = async (req, res) => {
  try {
    const response = await mongodb.getDb().db('MealPlanner').collection('users').find().toArray();
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db('MealPlanner')
      .collection('users')
      .findOne({ _id: userId });

    if (!response) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db('MealPlanner')
      .collection('users')
      .findOne({ _id: userId });

    if (!response) {
      return res.status(404).json({ message: 'User not found' });
    }

    const favoriteRecipeIds = response.favoriteRecipes || [];
    const favoriteRecipes = await Promise.all(
      favoriteRecipeIds.map((id) =>
        mongodb
          .getDb()
          .db('MealPlanner')
          .collection('recipes')
          .findOne({ _id: new ObjectId(id) })
      )
    );

    res.status(200).json(favoriteRecipes);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      createdRecipes: req.body.createdRecipes || [],
      favoriteRecipes: req.body.favoriteRecipes || [],
      mealPlans: req.body.mealPlans || [],
      groceryList: req.body.groceryList || ''
    };

    const response = await mongodb.getDb().db('MealPlanner').collection('users').insertOne(newUser);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ message: 'Failed to create user' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const addFavorite = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db('MealPlanner')
      .collection('users')
      .findOne({ _id: userId });

    if (!response) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recipeId = req.params.recipeID;
    if (response.favoriteRecipes && response.favoriteRecipes.includes(recipeId)) {
      return res.status(400).json({ message: 'Recipe is already in favorites' });
    }

    const result = await mongodb
      .getDb()
      .db('MealPlanner')
      .collection('users')
      .updateOne({ _id: userId }, { $addToSet: { favoriteRecipes: recipeId } });

    if (result.modifiedCount > 0) {
      res.status(201).json({ message: 'Recipe added to favorites' });
    } else {
      res.status(500).json({ message: 'Failed to add favorite recipe' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);

    const updateUser = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      createdRecipes: req.body.createdRecipes || [],
      favoriteRecipes: req.body.favoriteRecipes || [],
      mealPlans: req.body.mealPlans || [],
      groceryList: req.body.groceryList || ''
    };

    const response = await mongodb
      .getDb()
      .db('MealPlanner')
      .collection('users')
      .replaceOne({ _id: userId }, updateUser);

    if (response.modifiedCount > 0) {
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found or no changes made' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);

    const response = await mongodb
      .getDb()
      .db('MealPlanner')
      .collection('users')
      .deleteOne({ _id: userId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(500).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db('MealPlanner')
      .collection('users')
      .findOne({ _id: userId });

    if (!response) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recipeId = req.params.recipeID;
    if (!response.favoriteRecipes || !response.favoriteRecipes.includes(recipeId)) {
      return res.status(400).json({ message: 'Recipe is already not a favorite' });
    }

    const result = await mongodb
      .getDb()
      .db('MealPlanner')
      .collection('users')
      .updateOne({ _id: userId }, { $pull: { favoriteRecipes: recipeId } });

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Recipe removed from favorites' });
    } else {
      res.status(500).json({ message: 'Failed to remove favorite recipe' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  getFavorites,
  createUser,
  addFavorite,
  updateUser,
  deleteUser,
  removeFavorite
};
