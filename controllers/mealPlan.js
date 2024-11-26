const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getMealPlan = async (req, res) => {
    try {
        const mealPlanId = new ObjectId(req.params.id);
        const response = await mongodb.getDb().db('MealPlanner').collection('meal-plan').find({ _id: mealPlanId }).toArray();
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
const createMealPlan = async (/*req, res*/) => {};
const updateMealPlan = async (/*req, res*/) => {};
const deleteMealPlan = async (/*req, res*/) => {};

module.exports = { getMealPlan, createMealPlan, updateMealPlan, deleteMealPlan }