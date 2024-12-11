const app = require('./app');
const mongodb = require('./db/connect');

const PORT = process.env.PORT || 3000;

// Initialize the database and start the server
mongodb.initDb((err) => {
  if (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  } else {
    app.listen(PORT, () => {
      console.log(`Connected to DB and listening on port ${PORT}`);
    });
  }
});
