import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const UserDashboard = () => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>My Tasks</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Priority</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Update profile information</TableCell>
              <TableCell align="right">Pending</TableCell>
              <TableCell align="right">High</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Review tenant guidelines</TableCell>
              <TableCell align="right">In Progress</TableCell>
              <TableCell align="right">Medium</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Submit monthly report</TableCell>
              <TableCell align="right">Completed</TableCell>
              <TableCell align="right">Low</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserDashboard;
