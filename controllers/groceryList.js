const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getGroceryList = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('Must use a valid grocery list id to find a grocery list');
  }

  const listId = new ObjectId(req.params.id);
  try {
    const result = await mongodb
      .getDb()
      .db('MealPlanner')
      .collection('grocery-list')
      .findOne({ _id: listId });

    if (!result) {
      return res.status(404).json({ message: 'Grocery list not found' });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createGroceryList = async (req, res) => {
  try {
    const newList = {
      items: req.body.items || [],
      creationDate: new Date().toISOString().split('T')[0]
    };

    const response = await mongodb
      .getDb()
      .db('MealPlanner')
      .collection('grocery-list')
      .insertOne(newList);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ message: 'Failed to create grocery list' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateGroceryList = async (req, res) => {
  try {
    const listId = new ObjectId(req.params.id);

    const updateList = {
      items: req.body.items || [],
      creationDate: new Date().toISOString().split('T')[0]
    };

    const response = await mongodb
      .getDb()
      .db('MealPlanner')
      .collection('grocery-list')
      .replaceOne({ _id: listId }, updateList);

    if (response.modifiedCount > 0) {
      res.status(200).json({ message: 'Grocery list updated successfully' });
    } else {
      res.status(404).json({ message: 'Grocery list not found or no changes made' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteGroceryList = async (req, res) => {
  try {
    const listId = new ObjectId(req.params.id);

    const response = await mongodb
      .getDb()
      .db('MealPlanner')
      .collection('grocery-list')
      .deleteOne({ _id: listId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getGroceryList, createGroceryList, updateGroceryList, deleteGroceryList };
