import React, { useContext, useState } from "react";
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
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { TodosContext } from "../../context/TodoContext";

const TodosList = () => {
  const { todos, deleteTodo, updateTodo } = useContext(TodosContext);

  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [editDialog, setEditDialog] = useState({ open: false, todo: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, todoId: null });

  // Open edit dialog
  const handleEditOpen = (todo) => {
    setEditDialog({ open: true, todo: { ...todo } });
  };

  // Handle edit input changes
  const handleEditChange = (e) => {
    setEditDialog((prev) => ({
      ...prev,
      todo: { ...prev.todo, [e.target.name]: e.target.value },
    }));
  };

  // Save edited todo
  const handleEditSave = async () => {
    const { id, title, description } = editDialog.todo;
    if (!title) {
      setToast({ open: true, message: "Title cannot be empty", severity: "error" });
      return;
    }

    try {
      await updateTodo(id, { title, description });
      setToast({ open: true, message: "Todo updated successfully", severity: "success" });
      setEditDialog({ open: false, todo: null });
    } catch (err) {
      setToast({ open: true, message: "Failed to update todo", severity: "error" });
    }
  };

  // Open delete confirmation
  const handleDeleteOpen = (todoId) => {
    setDeleteDialog({ open: true, todoId });
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    try {
      await deleteTodo(deleteDialog.todoId);
      setToast({ open: true, message: "Todo deleted successfully", severity: "info" });
      setDeleteDialog({ open: false, todoId: null });
    } catch (err) {
      setToast({ open: true, message: "Failed to delete todo", severity: "error" });
    }
  };

  // Mark completed
  const handleComplete = async (id) => {
    try {
      await updateTodo(id, { status: "Completed" });
      setToast({ open: true, message: "Todo marked as completed", severity: "success" });
    } catch (err) {
      setToast({ open: true, message: "Failed to mark as completed", severity: "error" });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Todos
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Add, edit, delete and complete your tasks easily.
      </Typography>

      <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          {todos.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todos.map((todo) => (
                    <TableRow key={todo.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                      <TableCell>{todo.title}</TableCell>
                      <TableCell>{todo.description || "-"}</TableCell>
                      <TableCell>{todo.status || "Pending"}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Mark Completed">
                          <span>
                            <IconButton
                              color="success"
                              onClick={() => handleComplete(todo.id)}
                              disabled={todo.status === "Completed"}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton color="primary" onClick={() => handleEditOpen(todo)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => handleDeleteOpen(todo.id)}>
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
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              No todos found. Add some tasks to get started!
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, todo: null })}>
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={editDialog.todo?.title || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={editDialog.todo?.description || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, todo: null })}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, todoId: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this todo?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, todoId: null })}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Snackbar */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TodosList;
