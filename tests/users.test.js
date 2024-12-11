// Mock express-openid-connect before importing app
jest.mock('express-openid-connect', () => ({
  auth: jest.fn(() => (req, res, next) => next())
}));

// Mock requiresAuth middleware
jest.mock('../middleware/requiresAuth', () => jest.fn(() => (req, res, next) => next()));

const mockUsers = [
  {
    _id: '6744d93c9476bc5699b1182a',
    username: 'user456',
    password: 'password456',
    email: 'user456@example.com',
    createdRecipes: ['6740492e5a6a3656aaee96fa'],
    favoriteRecipes: ['6740492e5a6a3656aaee96fb', '6740492e5a6a3656aaee96fc'],
    mealPlans: [],
    groceryList: ''
  },
  {
    _id: '6744d93c9476bc5699b1182b',
    username: 'user789',
    password: 'password789',
    email: 'user789@example.com',
    createdRecipes: [],
    favoriteRecipes: ['6740492e5a6a3656aaee96fa'],
    mealPlans: [],
    groceryList: ''
  },
  {
    _id: '67454a5f8be94bfcec0c4d01',
    username: 'user123',
    password: 'password123',
    email: 'example@gmail.com',
    createdRecipes: ['6740492e5a6a3656aaee96fa', '6740492e5a6a3656aaee96fb'],
    favoriteRecipes: ['6740492e5a6a3656aaee96fc'],
    mealPlans: [],
    groceryList: ''
  }
];

// Mock the database connection
jest.mock('../db/connect', () => {
  const { ObjectId } = require('mongodb');
  return {
    getDb: jest.fn(() => ({
      db: jest.fn(() => ({
        collection: jest.fn(() => ({
          find: jest.fn(() => ({
            toArray: jest.fn().mockResolvedValue(mockUsers)
          })),
          findOne: jest
            .fn()
            .mockImplementation((query) =>
              mockUsers.find((user) => user._id.toString() === query._id.toString())
            ),
          insertOne: jest.fn((newUser) => {
            const insertedUser = { ...newUser, _id: new ObjectId() };
            mockUsers.push(insertedUser);
            return { acknowledged: true, insertedId: insertedUser._id };
          }),
          replaceOne: jest.fn((query, alteredUser) => {
            const index = mockUsers.findIndex((user) => user._id === query._id.toString());
            mockUsers[index] = { ...alteredUser, _id: query._id.toString() };
            return { acknowledged: true, modifiedCount: 1 };
          }),
          deleteOne: jest.fn((query) => {
            const index = mockUsers.findIndex(
              (user) => user._id.toString() === query._id.toString()
            );
            mockUsers.splice(index, 1);
            return { acknowledged: true, deletedCount: 1 };
          }),
          updateOne: jest.fn((query, update) => {
            const user = mockUsers.find((user) => user._id.toString() === query._id.toString());
            if (user && update.$addToSet && update.$addToSet.favoriteRecipes) {
              if (Array.isArray(update.$addToSet.favoriteRecipes)) {
                user.favoriteRecipes.push(...update.$addToSet.favoriteRecipes);
              } else {
                user.favoriteRecipes.push(update.$addToSet.favoriteRecipes);
              }
            }
            return { acknowledged: true, modifiedCount: 1 };
          })
        }))
      }))
    }))
  };
});

const request = require('supertest');
const app = require('../app');

describe('Users API', () => {
  // Get all users
  test('should get all users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(3);
    expect(res.body[0]).toHaveProperty('username', 'user456');
  });

  // Get a single user
  test('should get a single user', async () => {
    const userId = '6744d93c9476bc5699b1182b';
    const res = await request(app).get(`/users/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', userId);
    expect(res.body).toHaveProperty('username', 'user789');
  });

  // Create a new user
  test('should create a new user', async () => {
    const newUser = {
      username: 'newuser',
      password: 'newpassword',
      email: 'newuser@example.com',
      createdRecipes: [],
      favoriteRecipes: [],
      mealPlans: [],
      groceryList: ''
    };

    const res = await request(app).post(`/users`).send(newUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('acknowledged', true);
    expect(res.body).toHaveProperty('insertedId');

    expect(mockUsers).toContainEqual(expect.objectContaining({ username: newUser.username }));
  });

  // Alter an existing user
  test('should edit an existing user', async () => {
    const alteredUser = {
      username: 'altereduser',
      password: 'alteredpassword',
      email: 'altereduser@example.com',
      createdRecipes: [],
      favoriteRecipes: [],
      mealPlans: [],
      groceryList: ''
    };

    const userId = '6744d93c9476bc5699b1182b';
    const res = await request(app).put(`/users/${userId}`).send(alteredUser);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'User updated successfully');

    const updatedUser = mockUsers.find((user) => user._id === userId);
    expect(updatedUser).toEqual(expect.objectContaining(alteredUser));
  });

  // Delete an existing user
  test('should delete an existing user', async () => {
    const userId = '6744d93c9476bc5699b1182b';
    const res = await request(app).delete(`/users/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'User deleted successfully');

    expect(mockUsers.find((user) => user._id === userId)).toEqual(undefined);
  });

  // Get a single user's favorite recipes
  test("should get a single user's favorite recipes", async () => {
    const userId = '6744d93c9476bc5699b1182a';
    const res = await request(app).get(`/users/${userId}/favorites`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  test("should add a recipe to the user's favorites", async () => {
    const userId = mockUsers[0]._id.toString();
    const recipeId = '6740492e5a6a3656aaee96fd';

    const response = await request(app).post(`/users/${userId}/favorites/${recipeId}`).send();

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Recipe added to favorites');
  });

  test('should remove a favorite recipe for a user', async () => {
    const userId = '6744d93c9476bc5699b1182a';
    const recipeId = '6740492e5a6a3656aaee96fc';

    const res = await request(app).delete(`/users/${userId}/favorite/${recipeId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Recipe removed from favorites');
  });
});
