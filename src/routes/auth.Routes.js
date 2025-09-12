import express from "express"
import { authenticateJWT } from "../middlewares/authenticateJWT.js"
const app = express.Router()

// Import authentication controllers
import { signup, login , changePassword } from "../controllers/auth.Controller.js"
// Import middleware for authentication

app.post("/signup", signup)
app.post("/login", login)
app.patch("/change-password", authenticateJWT, changePassword)

export default app