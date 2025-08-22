import express from "express"

const app = express.Router()

// Import authentication controllers
import { signup, login } from "../controllers/authController.js"
// Import middleware for authentication

app.post("/signup", signup)
app.post("/login", login)

export default app