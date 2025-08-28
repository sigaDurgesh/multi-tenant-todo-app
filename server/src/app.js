import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import cors from 'cors';
import tenantRequestRoutes from './routes/tenantRequest.routes.js';
import authRouter from "./routes/auth.Routes.js";

dotenv.config();

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // For JSON body parsing
app.use(express.urlencoded({ extended: true })); // For URL-encoded body parsing

app.use("/tenant-requests", tenantRequestRoutes);
app.use('/api/auth', authRouter); // Mount the auth routes

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