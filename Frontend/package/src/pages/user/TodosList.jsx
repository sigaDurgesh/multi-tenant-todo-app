import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const TodosList = () => {
  const [todos, setTodos] = useState([]);
  const [success, setSuccess] = useState(false);

  // ✅ Load todos from localStorage on mount
  useEffect(() => {
    const storedTodos = localStorage.getItem("todo");
    if (storedTodos) {
      try {
        setTodos(JSON.parse(storedTodos));
      } catch (err) {
        console.error("Error parsing todos from localStorage:", err);
      }
    }
  }, []);

  // ✅ Save todos back to localStorage whenever they change
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("todo", JSON.stringify(todos));
    }
  }, [todos]);

  // Delete todo
  const handleDelete = (id) => {
    const updated = todos.filter((t, index) => index !== id);
    setTodos(updated);
    setSuccess(true);
  };

  // Mark todo completed
  const handleComplete = (id) => {
    const updated = todos.map((t, index) =>
      index === id ? { ...t, status: "Completed" } : t
    );
    setTodos(updated);
    setSuccess(true);
  };

  return (
    <div>
      {/* Page Header */}
      <Typography variant="h5" gutterBottom>
        My Todos
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Track your tasks, update progress, and manage deadlines.
      </Typography>

      {/* Todo List */}
      <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          {todos.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todos.map((todo, index) => (
                    <TableRow key={index}>
                      <TableCell>{todo.title}</TableCell>
                      <TableCell>{todo.description}</TableCell>
                      <TableCell>{todo.dueDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={todo.priority}
                          color={
                            todo.priority === "High"
                              ? "error"
                              : todo.priority === "Medium"
                              ? "warning"
                              : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={todo.status}
                          color={
                            todo.status === "Completed"
                              ? "success"
                              : todo.status === "In Progress"
                              ? "info"
                              : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Mark Completed">
                          <IconButton
                            color="success"
                            onClick={() => handleComplete(index)}
                            disabled={todo.status === "Completed"}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton color="primary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No todos found. Please add some tasks!
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Action completed successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TodosList;
