const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllUsers = async (/*req, res*/) => {};
const getUser = async (/*req, res*/) => {};
const getFavorites = async (/*req, res*/) => {};
const createUser = async (/*req, res*/) => {};
const addFavorite = async (/*req, res*/) => {};
const updateUser = async (/*req, res*/) => {};
const deleteUser = async (/*req, res*/) => {};
const removeFavorite = async(/*req, res*/) => {};

module.exports = { getAllUsers, getUser, getFavorites, createUser, addFavorite, updateUser, deleteUser, removeFavorite }