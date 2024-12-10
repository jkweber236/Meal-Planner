const express = require('express');
const bodyParser = require('body-parser');
const { auth } = require('express-openid-connect');
const routes = require('./routes');

const app = express();

// Authentication configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: 'http://localhost:3000',
  clientID: 'd6pziGH6szkwHUsypL1src6rDvPcGpkH',
  issuerBaseURL: 'https://dev-miy8hcfxznthy6sk.us.auth0.com'
};

// Apply authentication middleware
app.use(auth(config));

// Root route
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// Apply other middlewares and routes
app
  .use(bodyParser.json())
  .use('/', routes)
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });

// Global error handling for uncaught exceptions
process.on('uncaughtException', (err, origin) => {
  console.error(`Caught exception: ${err}\nException origin: ${origin}`);
});

module.exports = app;
