import express from 'express';
import { authenticateJWT } from '../middlewares/authenticateJWT.js';
import {
  createTodo,
  getTodos,       
  updateTodo,
  deleteTodo,
  getTodoById
} from '../controllers/todoController.js';
const router = express.Router();  
// Create a new todo
router.post('/', authenticateJWT , createTodo);
// Get todos for the logged-in user
router.get('/', authenticateJWT , getTodos);
// Update a todo
router.put('/:id', authenticateJWT , updateTodo); 
// Delete a todo  
router.delete('/:id', authenticateJWT , deleteTodo);  
// Get a specific todo by ID
router.get('/:id', authenticateJWT , getTodoById);
export default router;
