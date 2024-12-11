const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Meal Planner API'
  },
  host: 'meal-planner-dot1.onrender.com',
  schemes: ['https'],
  tags: [
    { name: 'Users', description: 'Endpoints for managing users' },
    { name: 'Recipes', description: 'Endpoints for managing recipes' },
    { name: 'Meal Plans', description: 'Endpoints for managing meal plans' },
    { name: 'Grocery Lists', description: 'Endpoints for managing grocery lists' }
  ]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
