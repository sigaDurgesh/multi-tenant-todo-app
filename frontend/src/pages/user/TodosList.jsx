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
  Stack,
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

  const handleEditOpen = (todo) => setEditDialog({ open: true, todo: { ...todo } });

  const handleEditChange = (e) => {
    setEditDialog((prev) => ({
      ...prev,
      todo: { ...prev.todo, [e.target.name]: e.target.value },
    }));
  };

  const handleEditSave = async () => {
    const { id, title, description } = editDialog.todo;
    if (!title.trim()) {
      setToast({ open: true, message: "Title cannot be empty", severity: "error" });
      return;
    }
    try {
      await updateTodo(id, { title, description });
      setToast({ open: true, message: "Todo updated successfully", severity: "success" });
      setEditDialog({ open: false, todo: null });
    } catch {
      setToast({ open: true, message: "Failed to update todo", severity: "error" });
    }
  };

  const handleDeleteOpen = (todoId) => setDeleteDialog({ open: true, todoId });

  const handleDeleteConfirm = async () => {
    try {
      await deleteTodo(deleteDialog.todoId);
      setToast({ open: true, message: "Todo deleted successfully", severity: "info" });
      setDeleteDialog({ open: false, todoId: null });
    } catch {
      setToast({ open: true, message: "Failed to delete todo", severity: "error" });
    }
  };

  const handleComplete = async (id) => {
    try {
      await updateTodo(id, { status: "Completed" });
      setToast({ open: true, message: "Todo marked as completed", severity: "success" });
    } catch {
      setToast({ open: true, message: "Failed to mark as completed", severity: "error" });
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        My Todos
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Manage your tasks efficiently. Add, edit, delete, or complete your todos.
      </Typography>

      <Card sx={{ mt: 4, borderRadius: 3, boxShadow: 6 }}>
        <CardContent>
          {todos.length > 0 ? (
            <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todos.map((todo) => (
                    <TableRow
                      key={todo.id}
                      sx={{
                        "&:hover": { backgroundColor: "#fafafa" },
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <TableCell>{todo.title}</TableCell>
                      <TableCell>{todo.description || "-"}</TableCell>
                      <TableCell>
                        <Typography
                          color={todo.status === "Completed" ? "green" : "text.primary"}
                          fontWeight={todo.status === "Completed" ? 600 : 400}
                        >
                          {todo.status || "Pending"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
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
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2, textAlign: "center" }}>
              No todos found. Add your first task to get started!
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, todo: null })}
        maxWidth="sm"
        fullWidth
      >
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
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, todoId: null })}
        maxWidth="xs"
        fullWidth
      >
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
