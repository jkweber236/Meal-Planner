const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllRecipes = async (req, res) => {
  try {
    const response = await mongodb.getDb().db('MealPlanner').collection('recipes').find().toArray();
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getRecipe = async (req, res) => {
  try {
    const recipeId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db('MealPlanner').collection('recipes').find({ _id: recipeId }).toArray();
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createRecipe = async (req, res) => {
  try {
    const recipe = {
      name: req.body.name,
      creatorId: req.params.userid,
      category: req.body.cateogry,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      prepTime: req.body.prepTime,
      cookTime: req.body.cookTime,
      createdDate: new Date().toISOString().split('T')[0]
    };
    const response = await mongodb.getDb().db('MealPlanner').collection('recipes').insertOne(recipe);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const recipeId = new ObjectId(req.params.id);
    const updatedFields = {
      name: req.body.name,
      category: req.body.category, 
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      prepTime: req.body.prepTime,
      cookTime: req.body.cookTime,
    };
    const response = await mongodb.getDb().db('MealPlanner').collection('recipes').updateOne(
      { _id: recipeId },
      { $set: updatedFields }
    );
    if (response.matchedCount === 0) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    const updatedRecipe = await mongodb.getDb().db('MealPlanner').collection('recipes').findOne({ _id: recipeId });
    res.status(200).json(updatedRecipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const recipeId = new ObjectId(req.params.id)
    const response = await mongodb.getDb().db('MealPlanner').collection('recipes').deleteOne({ _id: recipeId });
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe };
