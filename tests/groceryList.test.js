// Mock express-openid-connect before importing app
jest.mock('express-openid-connect', () => ({
  auth: jest.fn(() => (req, res, next) => next()) // Bypass auth middleware
}));

// Mock requiresAuth middleware
jest.mock('../middleware/requiresAuth', () => jest.fn(() => (req, res, next) => next()));

const mockGroceryList = [
  {
    _id: '67454fbb9476bc5699b1182f',
    items: [
      {
        item: 'apples',
        quantity: 1
      },
      {
        item: 'bananas',
        quantity: 2
      },
      {
        item: 'carrots',
        quantity: 3
      },
      {
        item: 'doritos',
        quantity: 1
      }
    ],
    creationDate: '2024/09/07'
  },

  {
    _id: '67454fbb9476bc5699b11830',
    items: [
      {
        item: 'milk',
        quantity: 1
      },
      {
        item: 'bread',
        quantity: 2
      },
      {
        item: 'eggs',
        quantity: 12
      },
      {
        item: 'cheese',
        quantity: 1
      }
    ],
    creationDate: '2024/10/15'
  },

  {
    _id: '67454fbb9476bc5699b11831',
    items: [
      {
        item: 'potatoes',
        quantity: 5
      },
      {
        item: 'onions',
        quantity: 3
      },
      {
        item: 'tomatoes',
        quantity: 4
      },
      {
        item: 'chicken breasts',
        quantity: 2
      }
    ],
    creationDate: '2024/11/01'
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
            toArray: jest.fn().mockResolvedValue(mockGroceryList)
          })),
          findOne: jest
            .fn()
            .mockImplementation((query) =>
              mockGroceryList.find(
                (groceryList) => groceryList._id.toString() === query._id.toString()
              )
            ),
          insertOne: jest.fn((newGroceryList) => {
            const insertedGroceryList = { ...newGroceryList, _id: new ObjectId() };
            mockGroceryList.push(insertedGroceryList);
            return { acknowledged: true, insertedId: insertedGroceryList._id };
          }),
          deleteOne: jest.fn((query) => {
            const index = mockGroceryList.findIndex(
              (groceryList) => groceryList._id.toString() === query._id.toString()
            );
            mockGroceryList.splice(index, 1);
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
const app = require('../app');

describe('Grocery List API', () => {
  // Get a single grocery List
  test('should get a single grocery list', async () => {
    const groceryListId = '67454fbb9476bc5699b1182f';
    const res = await request(app).get(`/grocery-list/${groceryListId}`);

    expect(res.statusCode).toBe(200);
  });

  // Create a new grocery list
  test('should create a new grocery list', async () => {
    const newGroceryList = {
      items: [],
      creationDate: 'today'
    };

    const res = await request(app).post(`/meal-plan`).send(newGroceryList);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('acknowledged', true);
    expect(res.body).toHaveProperty('insertedId');
  });

  // Alter an existing grocery list
  test('should edit an existing grocery list', async () => {
    const alteredGroceryList = {
      items: [],
      creationDate: 'yesterday'
    };

    const groceryListId = '67454fbb9476bc5699b1182f';
    const res = await request(app).put(`/meal-plan/${groceryListId}`).send(alteredGroceryList);

    expect(res.statusCode).toBe(200);
  });

  // Delete an existing grocery list
  test('should delete an existing grocery list', async () => {
    const groceryListId = '67454fbb9476bc5699b1182f';
    const res = await request(app).delete(`/grocery-list/${groceryListId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Grocery list deleted successfully');
  });
});
