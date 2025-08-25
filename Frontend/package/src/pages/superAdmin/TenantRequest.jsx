import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Button,
  Stack,
  Paper,
  TextField,
  TablePagination,
  Checkbox,
} from "@mui/material";
import { CheckCircle, XCircle, RefreshCw, Search } from "lucide-react";

// Dummy data (replace with API later)
const dummyRequests = [
  {
    id: 1,
    orgName: "TechCorp Pvt Ltd",
    adminEmail: "admin@techcorp.com",
    status: "pending",
    requestedAt: "2025-08-20T09:15:00",
  },
  {
    id: 2,
    orgName: "InnoSoft Solutions",
    adminEmail: "contact@innosoft.com",
    status: "pending",
    requestedAt: "2025-08-21T11:30:00",
  },
  {
    id: 3,
    orgName: "Alpha Systems",
    adminEmail: "alpha@systems.com",
    status: "approved",
    requestedAt: "2025-08-19T14:10:00",
  },
  {
    id: 4,
    orgName: "Beta Innovations",
    adminEmail: "beta@innov.com",
    status: "rejected",
    requestedAt: "2025-08-18T08:45:00",
  },
];

const TenantRequest = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);

  // Simulate API call
  useEffect(() => {
    setTimeout(() => {
      // Sort by date desc by default
      const sorted = [...dummyRequests].sort(
        (a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)
      );
      setRequests(sorted);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApprove = (id) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "approved" } : req))
    );
  };

  const handleReject = (id) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "rejected" } : req))
    );
  };

  const handleBulkAction = (action) => {
    setRequests((prev) =>
      prev.map((req) =>
        selected.includes(req.id) ? { ...req, status: action } : req
      )
    );
    setSelected([]);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setRequests(dummyRequests);
      setLoading(false);
    }, 1000);
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.orgName.toLowerCase().includes(search.toLowerCase()) ||
      req.adminEmail.toLowerCase().includes(search.toLowerCase()) ||
      req.status.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const ids = filteredRequests.map((req) => req.id);
      setSelected(ids);
    } else {
      setSelected([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  return (
    <Box p={3}>
      <Card elevation={3}>
        <CardContent>
          {/* Header */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            mb={2}
            spacing={2}
          >
            <Typography variant="h5" fontWeight="bold">
              Tenant Requests
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                placeholder="Search by org, email, or status"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
                }}
              />
              <Button
                variant="outlined"
                startIcon={<RefreshCw size={18} />}
                onClick={handleRefresh}
              >
                Refresh
              </Button>
            </Stack>
          </Stack>

          {/* Bulk Actions */}
          {selected.length > 0 && (
            <Stack direction="row" spacing={2} mb={2}>
              <Typography variant="body2" fontWeight="500">
                {selected.length} selected
              </Typography>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleBulkAction("approved")}
              >
                Approve Selected
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleBulkAction("rejected")}
              >
                Reject Selected
              </Button>
            </Stack>
          )}

          {/* Table */}
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={5}>
              <CircularProgress />
            </Box>
          ) : filteredRequests.length === 0 ? (
            <Typography textAlign="center" color="textSecondary" py={5}>
              No matching tenant requests 🎉
            </Typography>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={
                            selected.length > 0 &&
                            selected.length < filteredRequests.length
                          }
                          checked={
                            filteredRequests.length > 0 &&
                            selected.length === filteredRequests.length
                          }
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell>Organization</TableCell>
                      <TableCell>Admin Email</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Requested At</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRequests
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((req) => (
                        <TableRow key={req.id} hover>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selected.includes(req.id)}
                              onChange={() => handleSelectRow(req.id)}
                            />
                          </TableCell>
                          <TableCell>{req.orgName}</TableCell>
                          <TableCell>{req.adminEmail}</TableCell>
                          <TableCell>
                            <Chip
                              label={req.status}
                              color={
                                req.status === "approved"
                                  ? "success"
                                  : req.status === "rejected"
                                  ? "error"
                                  : "warning"
                              }
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(req.requestedAt).toLocaleString()}
                          </TableCell>
                          <TableCell align="center">
                            {req.status === "pending" ? (
                              <Stack
                                direction="row"
                                spacing={1}
                                justifyContent="center"
                              >
                                <IconButton
                                  color="success"
                                  onClick={() => handleApprove(req.id)}
                                >
                                  <CheckCircle />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  onClick={() => handleReject(req.id)}
                                >
                                  <XCircle />
                                </IconButton>
                              </Stack>
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                {req.status === "approved"
                                  ? "Approved ✅"
                                  : "Rejected ❌"}
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <TablePagination
                component="div"
                count={filteredRequests.length}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TenantRequest;
