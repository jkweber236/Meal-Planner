const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getMealPlan = async (req, res) => {
  try {
    const mealPlanId = new ObjectId(req.params.id);
    const mealPlan = await mongodb
      .getDb()
      .db('MealPlanner')
      .collection('meal-plan')
      .findOne({ _id: mealPlanId });

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found.' });
    }

    const meals = await Promise.all(
      mealPlan.meals.map(async (meal) => {
        if (meal.recipeID) {
          const recipe = await mongodb
            .getDb()
            .db('MealPlanner')
            .collection('recipes')
            .findOne({ _id: new ObjectId(meal.recipeID) }, { projection: { name: 1 } });

          return {
            mealDay: meal.mealDay,
            recipeName: recipe ? recipe.name : 'Recipe not found'
          };
        }
        return {
          mealDay: meal.mealDay,
          recipeName: null
        };
      })
    );

    res.status(200).json({
      weekStart: mealPlan.weekStart,
      weekEnd: mealPlan.weekEnd,
      createdDate: mealPlan.createdDate,
      meals: meals
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createMealPlan = async (req, res) => {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + 6);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const mealPlan = {
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      createdDate: new Date().toISOString().split('T')[0],
      meals: [
        { mealDay: 'Monday', recipeID: req.body.monRecipeID || null },
        { mealDay: 'Tuesday', recipeID: req.body.tuesRecipeID || null },
        { mealDay: 'Wednesday', recipeID: req.body.wedRecipeID || null },
        { mealDay: 'Thursday', recipeID: req.body.thursRecipeID || null },
        { mealDay: 'Friday', recipeID: req.body.friRecipeID || null },
        { mealDay: 'Saturday', recipeID: req.body.satRecipeID || null },
        { mealDay: 'Sunday', recipeID: req.body.sunRecipeID || null }
      ]
    };
    const response = await mongodb
      .getDb()
      .db('MealPlanner')
      .collection('meal-plan')
      .insertOne(mealPlan);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateMealPlan = async (req, res) => {
  try {
    const mealPlanId = new ObjectId(req.params.id);
    const updatedFields = {
      meals: [
        { mealDay: 'Monday', recipeID: req.body.monRecipeID || null },
        { mealDay: 'Tuesday', recipeID: req.body.tuesRecipeID || null },
        { mealDay: 'Wednesday', recipeID: req.body.wedRecipeID || null },
        { mealDay: 'Thursday', recipeID: req.body.thursRecipeID || null },
        { mealDay: 'Friday', recipeID: req.body.friRecipeID || null },
        { mealDay: 'Saturday', recipeID: req.body.satRecipeID || null },
        { mealDay: 'Sunday', recipeID: req.body.sunRecipeID || null }
      ]
    };
    const response = await mongodb
      .getDb()
      .db('MealPlanner')
      .collection('meal-plan')
      .updateOne({ _id: mealPlanId }, { $set: updatedFields });
    if (response.matchedCount === 0)
      return res.status(404).json({ message: 'Meal plan not found' });
    const updatedMealPlan = await mongodb
      .getDb()
      .db('MealPlanner')
      .collection('meal-plan')
      .findOne({ _id: mealPlanId });
    res.status(200).json(updatedMealPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMealPlan = async (req, res) => {
  try {
    const mealPlanId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db('MealPlanner')
      .collection('meal-plan')
      .deleteOne({ _id: mealPlanId });
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMealPlan, createMealPlan, updateMealPlan, deleteMealPlan };
