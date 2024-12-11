const request = require('supertest');
const app = require('../app');

// Mock requiresAuth middleware
jest.mock('../middleware/requiresAuth', () => jest.fn(() => (req, res, next) => next()));
jest.mock('express-openid-connect', () => ({
  auth: jest.fn(() => (req, res, next) => {
    req.oidc = { isAuthenticated: jest.fn().mockReturnValue(false) };
    next();
  })
}));

describe('App API', () => {
  test('GET / should return Logged since they are not authenticated', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'Logged out' });
  });
});
