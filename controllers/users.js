const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllUsers = async (req, res) => {
  try {
    const users = await mongodb.getDb().db('MealPlanner').collection('users').find().toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const user = await mongodb
      .getDb()
      .db('MealPlanner')
      .collection('users')
      .findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const user = await mongodb
      .getDb()
      .db('MealPlanner')
      .collection('users')
      .findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Extract the favorite recipe IDs
    const favoriteRecipeIds = user.favoriteRecipes || [];

    // Fetch all favorite recipes using Promise.all
    const favoriteRecipes = await Promise.all(
      favoriteRecipeIds.map(async (id) => {
        return await mongodb
          .getDb()
          .db('MealPlanner')
          .collection('recipes') // Assuming the recipes are stored in a 'recipes' collection
          .findOne({ _id: new ObjectId(id) });
      })
    );
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(favoriteRecipes);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createUser = async (req, res) => {
  const newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    createdRecipes: req.body.createdRecipes,
    favoriteRecipes: req.body.favoriteRecipes,
    mealPlans: req.body.mealPlans,
    groceryList: req.body.groceryList
  };
  const response = await mongodb.getDb().db('MealPlanner').collection('users').insertOne(newUser);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || "That didn't work..");
  }
};

const addFavorite = async (/*req, res*/) => {};
const updateUser = async (/*req, res*/) => {};
const deleteUser = async (/*req, res*/) => {};
const removeFavorite = async (/*req, res*/) => {};

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
