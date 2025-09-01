import React, { useContext, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { TodosContext } from "../../context/TodoContext";

const CreateTodo = () => {
  const { addTodo } = useContext(TodosContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Title is required!");
      return;
    }

    addTodo({ title, description });
    setTitle("");
    setDescription("");
    setSuccess(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Create New Todo
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Add your task with details and keep track of progress.
      </Typography>

      {/* Form Card */}
      <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
                placeholder="Enter todo title"
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={3}
                placeholder="Enter description (optional)"
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  fontWeight: "bold",
                  textTransform: "none",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              >
                Add Todo
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          sx={{ width: "100%" }}
          onClose={() => setSuccess(false)}
        >
          ✅ Todo added successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateTodo;
