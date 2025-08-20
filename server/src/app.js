import express from 'express';
import dotenv from 'dotenv';
import sequelize from './db.js';

dotenv.config();

const app = express();
app.use(express.json()); // For JSON body parsing

const PORT = process.env.PORT || 5000;

// Connect to the database before starting the server
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to PostgreSQL via Sequelize');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ DB connection error:', err);
    process.exit(1); // Exit the process if DB connection fails
  });