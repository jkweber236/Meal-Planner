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
  clientID: process.env.CLIENTID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};

// Apply authentication middleware
app.use(auth(config));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ status: req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out' });
});

app
  .use(bodyParser.json())
  .use('/', routes)
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });

process.on('uncaughtException', (err, origin) => {
  console.error(`Caught exception: ${err}\nException origin: ${origin}`);
});

module.exports = app;
