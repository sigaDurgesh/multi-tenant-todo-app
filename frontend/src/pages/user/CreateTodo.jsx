import React, { useContext, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Box,
  Stack,
} from "@mui/material";
import { TodosContext } from "../../context/TodoContext";

const CreateTodo = () => {
  const { addTodo } = useContext(TodosContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) {
      setSuccess(false);
      alert("Title is required!");
      return;
    }

    addTodo({ title, description });
    setTitle("");
    setDescription("");
    setSuccess(true);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Create New Todo
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Add your task with details and keep track of progress.
      </Typography>

      {/* Form Card */}
      <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 6 }}>
        <CardContent>
          <Stack spacing={3}>
            {/* Title */}
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              placeholder="Enter todo title"
              size="medium"
            />

            {/* Description */}
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={4} // slightly taller than before, but proportional
              placeholder="Enter description (optional)"
            />

            {/* Submit Button */}
            <Box sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                sx={{
                  borderRadius: 3,
                  px: 5,
                  py: 1.5,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  fontWeight: "bold",
                  textTransform: "none",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.03)",
                  },
                }}
              >
                Add Todo
              </Button>
            </Box>
          </Stack>
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
