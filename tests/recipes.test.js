// Mock express-openid-connect before importing app
jest.mock('express-openid-connect', () => ({
  auth: jest.fn(() => (req, res, next) => next())
}));

// Mock requiresAuth middleware
jest.mock('../middleware/requiresAuth', () => jest.fn(() => (req, res, next) => next()));

const mockRecipes = [
  {
    _id: '6740492e5a6a3656aaee96fa',
    creatorID: 'user123',
    name: 'Spaghetti Carbonara',
    category: 'Italian',
    ingredients: [
      {
        item: 'Spaghetti',
        quantity: '200g'
      },
      {
        item: 'Eggs',
        quantity: '2 large'
      },
      {
        item: 'Parmesan Cheese',
        quantity: '50g'
      },
      {
        item: 'Pancetta',
        quantity: '100g'
      },
      {
        item: 'Black Pepper',
        quantity: 'to taste'
      },
      {
        item: 'Salt',
        quantity: 'to taste'
      }
    ],
    instructions: [
      'Cook the spaghetti in salted boiling water until al dente.',
      'In a bowl, whisk the eggs with grated Parmesan cheese.',
      'Fry the pancetta until crispy.',
      'Drain the pasta, reserving some cooking water.',
      'Mix the hot pasta with the egg and cheese mixture, adding reserved water if needed.',
      'Stir in the pancetta and season with black pepper.'
    ],
    prepTime: '10 minutes',
    cookTime: '15 minutes',
    createdDate: '2024-11-21'
  },
  {
    _id: '6740492e5a6a3656aaee96fb',
    creatorID: 'user124',
    name: 'Pancakes',
    category: 'Breakfast',
    ingredients: [
      {
        item: 'Flour',
        quantity: '1 cup'
      },
      {
        item: 'Milk',
        quantity: '1 cup'
      },
      {
        item: 'Egg',
        quantity: '1 large'
      },
      {
        item: 'Butter',
        quantity: '2 tbsp, melted'
      },
      {
        item: 'Baking Powder',
        quantity: '2 tsp'
      },
      {
        item: 'Sugar',
        quantity: '2 tbsp'
      },
      {
        item: 'Salt',
        quantity: '1/4 tsp'
      }
    ],
    instructions: [
      'In a bowl, mix the flour, baking powder, sugar, and salt.',
      'Whisk together the milk, egg, and melted butter in another bowl.',
      'Combine wet and dry ingredients, mixing until just combined.',
      'Heat a lightly oiled griddle over medium heat.',
      'Pour 1/4 cup of batter for each pancake and cook until bubbles form.',
      'Flip and cook until golden brown on both sides.'
    ],
    prepTime: '5 minutes',
    cookTime: '15 minutes',
    createdDate: '2024-11-21'
  },
  {
    _id: '6740492e5a6a3656aaee96fc',
    creatorID: 'user125',
    name: 'Chicken Stir Fry',
    category: 'Asian',
    ingredients: [
      {
        item: 'Chicken Breast',
        quantity: '300g, sliced'
      },
      {
        item: 'Soy Sauce',
        quantity: '2 tbsp'
      },
      {
        item: 'Garlic',
        quantity: '2 cloves, minced'
      },
      {
        item: 'Ginger',
        quantity: '1 tsp, minced'
      },
      {
        item: 'Vegetable Oil',
        quantity: '2 tbsp'
      },
      {
        item: 'Mixed Vegetables',
        quantity: '2 cups'
      },
      {
        item: 'Cornstarch',
        quantity: '1 tsp (optional)'
      }
    ],
    instructions: [
      'Marinate chicken slices in soy sauce, garlic, and ginger for 15 minutes.',
      'Heat vegetable oil in a wok or large skillet.',
      'Stir fry chicken until lightly browned and cooked through.',
      'Add mixed vegetables and stir fry for another 5 minutes.',
      'Optional: Add cornstarch dissolved in water to thicken the sauce.',
      'Serve hot over steamed rice.'
    ],
    prepTime: '10 minutes',
    cookTime: '15 minutes',
    createdDate: '2024-11-21'
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
            toArray: jest.fn().mockResolvedValue(mockRecipes)
          })),
          findOne: jest
            .fn()
            .mockImplementation((query) =>
              mockRecipes.find((recipe) => recipe._id.toString() === query._id.toString())
            ),
          insertOne: jest.fn((newrecipe) => {
            const insertedrecipe = { ...newrecipe, _id: new ObjectId() };
            mockRecipes.push(insertedrecipe);
            return { acknowledged: true, insertedId: insertedrecipe._id };
          }),
          deleteOne: jest.fn((query) => {
            const index = mockRecipes.findIndex(
              (recipe) => recipe._id.toString() === query._id.toString()
            );
            mockRecipes.splice(index, 1);
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

describe('Recipes API', () => {
  // Get all recipes
  test('should get all recipes', async () => {
    const res = await request(app).get('/recipes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(3);
  });

  // Get a single recipe
  test('should get a single recipe', async () => {
    const recipeId = '6740492e5a6a3656aaee96fc';
    const res = await request(app).get(`/recipes/${recipeId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', recipeId);
  });

  // Create a new recipe
  test('should create a new recipe', async () => {
    const newrecipe = {
      name: 'example',
      category: 'example',
      ingredients: [
        {
          item: 'Spaghetti',
          quantity: '200g'
        },
        {
          item: 'Eggs',
          quantity: '2 large'
        },
        {
          item: 'Parmesan Cheese',
          quantity: '50g'
        },
        {
          item: 'Pancetta',
          quantity: '100g'
        },
        {
          item: 'Black Pepper',
          quantity: 'to taste'
        },
        {
          item: 'Salt',
          quantity: 'to taste'
        }
      ],
      instructions: [
        'Cook the spaghetti in salted boiling water until al dente.',
        'In a bowl, whisk the eggs with grated Parmesan cheese.',
        'Fry the pancetta until crispy.',
        'Drain the pasta, reserving some cooking water.',
        'Mix the hot pasta with the egg and cheese mixture, adding reserved water if needed.',
        'Stir in the pancetta and season with black pepper.'
      ],
      prepTime: 10000,
      cookTime: 10000
    };

    const userid = '6744d93c9476bc5699b1182a';
    const res = await request(app).post(`/recipes/${userid}`).send(newrecipe);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('acknowledged', true);
    expect(res.body).toHaveProperty('insertedId');
  });

  // Alter an existing recipe
  test('should edit an existing recipe', async () => {
    const alteredrecipe = {
      name: 'example',
      category: 'example',
      ingredients: [
        {
          item: 'Spaghetti',
          quantity: '200g'
        },
        {
          item: 'Eggs',
          quantity: '2 large'
        },
        {
          item: 'Parmesan Cheese',
          quantity: '50g'
        },
        {
          item: 'Pancetta',
          quantity: '100g'
        },
        {
          item: 'Black Pepper',
          quantity: 'to taste'
        },
        {
          item: 'Salt',
          quantity: 'to taste'
        }
      ],
      instructions: [
        'Cook the spaghetti in salted boiling water until al dente.',
        'In a bowl, whisk the eggs with grated Parmesan cheese.',
        'Fry the pancetta until crispy.',
        'Drain the pasta, reserving some cooking water.',
        'Mix the hot pasta with the egg and cheese mixture, adding reserved water if needed.',
        'Stir in the pancetta and season with black pepper.'
      ],
      prepTime: 10000,
      cookTime: 10000
    };

    const recipeId = '6740492e5a6a3656aaee96fa';
    const res = await request(app).put(`/recipes/${recipeId}`).send(alteredrecipe);

    expect(res.statusCode).toBe(200);
  });

  // Delete an existing recipe
  test('should delete an existing recipe', async () => {
    const recipeId = '6740492e5a6a3656aaee96fa';
    const res = await request(app).delete(`/recipes/${recipeId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('acknowledged', true);
    expect(res.body).toHaveProperty('deletedCount', 1);
  });
});
