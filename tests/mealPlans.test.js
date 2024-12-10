const { ObjectId } = require('mongodb');

// Mock express-openid-connect before importing app
jest.mock('express-openid-connect', () => ({
  auth: jest.fn(() => (req, res, next) => next()) // Bypass auth middleware
}));

// Mock requiresAuth middleware
jest.mock('../middleware/requiresAuth', () => jest.fn(() => (req, res, next) => next()));

const mockMealPlans = [
  {
    _id: '67456fa3d1764045717c4531',
    weekStart: '2024-11-25',
    weekEnd: '2024-12-01',
    createdDate: '2024-11-21',
    meals: [
      {
        mealDay: 'Monday',
        recipeID: '6740492e5a6a3656aaee96fa'
      },
      {
        mealDay: 'Tuesday',
        recipeID: '6740492e5a6a3656aaee96fc'
      },
      {
        mealDay: 'Wednesday',
        recipeID: null
      },
      {
        mealDay: 'Thursday',
        recipeID: null
      },
      {
        mealDay: 'Friday',
        recipeID: '6740492e5a6a3656aaee96fb'
      },
      {
        mealDay: 'Saturday',
        recipeID: '6740492e5a6a3656aaee96fc'
      },
      {
        mealDay: 'Sunday',
        recipeID: null
      }
    ]
  }
];

// Mock the database connection
jest.mock('../db/connect', () => {
  const { ObjectId } = require('mongodb'); // Import ObjectId here
  return {
    getDb: jest.fn(() => ({
      db: jest.fn(() => ({
        collection: jest.fn(() => ({
          find: jest.fn(() => ({
            toArray: jest.fn().mockResolvedValue(mockMealPlans)
          })),
          findOne: jest
            .fn()
            .mockImplementation((query) =>
              mockMealPlans.find((mealPlan) => mealPlan._id.toString() === query._id.toString())
            ),
          insertOne: jest.fn((newMealPlan) => {
            const insertedmealPlan = { ...newMealPlan, _id: new ObjectId() };
            mockMealPlans.push(insertedmealPlan);
            return { acknowledged: true, insertedId: insertedmealPlan._id };
          }),
          deleteOne: jest.fn((query) => {
            const index = mockMealPlans.findIndex(
              (mealPlan) => mealPlan._id.toString() === query._id.toString()
            );
            mockMealPlans.splice(index, 1);
            return { acknowledged: true, deletedCount: 1 };
          }),
          updateOne: jest.fn((query, update) => {
            return { acknowledged: true, modifiedCount: 1 };
          })
        }))
      }))
    }))
  };
});

const request = require('supertest');
const app = require('../app'); // Import the app, not server.js

describe('Meal Plans API', () => {
  // Get a single meal plan
  test('should get a single meal plan', async () => {
    const mealPlanId = '67456fa3d1764045717c4531';
    const res = await request(app).get(`/meal-plan/${mealPlanId}`);

    expect(res.statusCode).toBe(200);
  });

  // Create a new meal plan
  test('should create a new meal plan', async () => {
    const newMealPlan = {
      weekStart: 'tomorrow',
      weekEnd: 'the day after',
      createdDate: 'yessterday',
      meals: []
    };

    const res = await request(app).post(`/meal-plan`).send(newMealPlan);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('acknowledged', true);
    expect(res.body).toHaveProperty('insertedId');
  });

  // Alter an existing meal plan
  test('should edit an existing meal plan', async () => {
    const alteredMealPlan = {
      weekStart: 'tomorrow',
      weekEnd: 'the day after',
      createdDate: 'yessterday',
      meals: []
    };

    const mealPlanId = '67456fa3d1764045717c4531';
    const res = await request(app).put(`/meal-plan/${mealPlanId}`).send(alteredMealPlan);

    expect(res.statusCode).toBe(200);
  });

  // Delete an existing meal plan
  test('should delete an existing meal plan', async () => {
    const mealPlanId = '67456fa3d1764045717c4531';
    const res = await request(app).delete(`/meal-plan/${mealPlanId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('acknowledged', true);
    expect(res.body).toHaveProperty('deletedCount', 1);
  });
});
