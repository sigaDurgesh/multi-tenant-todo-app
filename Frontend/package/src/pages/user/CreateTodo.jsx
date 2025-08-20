import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";

const priorities = ["Low", "Medium", "High"];
const statuses = ["Pending", "In Progress", "Completed"];

const CreateTodo = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [success, setSuccess] = useState(false);

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    // simple validation
    if (!formData.title || !formData.dueDate) {
      alert("Please fill all required fields");
      return;
    }

    // Open confirmation dialog
    setOpenDialog(true);
  };

  // confirm save
  const handleConfirm = () => {
    setOpenDialog(false);

    // ✅ Get existing todos from localStorage
    const storedTodos = localStorage.getItem("todo");
    let todosArray = storedTodos ? JSON.parse(storedTodos) : [];

    // ✅ Append new todo
    const newTodo = {
      ...formData,
      id: Date.now(), // unique ID
    };
    todosArray.push(newTodo);

    // ✅ Save back to localStorage
    localStorage.setItem("todo", JSON.stringify(todosArray));

    console.log("Todo Created:", newTodo);

    setSuccess(true);

    // Reset form
    setFormData({
      title: "",
      description: "",
      priority: "Medium",
      status: "Pending",
      dueDate: "",
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Create New Todo
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Add your task with details, set priority, and track progress.
      </Typography>

      {/* Form Card */}
      <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Title */}
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>

              {/* Priority */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  fullWidth
                >
                  {priorities.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  fullWidth
                >
                  {statuses.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Due Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ borderRadius: 2, px: 4 }}
                >
                  Save Todo
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Todo</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to create this todo?
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            <strong>Title:</strong> {formData.title}
          </Typography>
          <Typography variant="subtitle2">
            <strong>Due Date:</strong> {formData.dueDate}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          ✅ Todo created successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateTodo;
