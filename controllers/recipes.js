const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllRecipes = async (req, res) => {
  try {
    const lists = await mongodb.getDb().db('MealPlanner').collection('recipes').find().toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getRecipe = async (/*req, res*/) => {};
const createRecipe = async (/*req, res*/) => {};
const updateRecipe = async (/*req, res*/) => {};
const deleteRecipe = async (/*req, res*/) => {};

module.exports = { getAllRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe };
