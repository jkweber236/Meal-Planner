const request = require('supertest');
// const app = require('../server'); // Make sure your app is exported in server.js

// describe('Users API', () => {
//   test('should get all users', async () => {
//     const res = await request(app).get('/users'); // Simulate the API call

//     expect(res.statusCode).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true); // Validate response structure
//   });
// });

test('1 + 1 should equal 2', () => {
  let a = 1;
  let b = 1;
  expect(a + b).toBe(2);
});
