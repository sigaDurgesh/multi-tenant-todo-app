import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Tabs,
  Tab,
  LinearProgress,
  Tooltip,
  Badge,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  ExpandMore as ExpandMoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  AttachMoney as AttachMoneyIcon,
  Storage as StorageIcon,
  CloudUpload as CloudUploadIcon,
  NoteAddRounded,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";

const SuperAdminDashboard = ({ navigate }) => {
  // Mock user context
  const user = { name: "John Admin", id: 1 };

  const { tenantRequestsCount } = useContext(AuthContext);
  console.log("total count from superadmin dash", tenantRequestsCount);


  // State management
  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [loadingTenants, setLoadingTenants] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch tenant requests from real API
  const mockTenantApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tenantApi.list(); // ✅ call real API
      if (Array.isArray(res.data)) {
        setTenants(res.data);
      } else {
        setTenants([]);
      }
    } catch (err) {
      console.error("Failed to fetch tenants:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Real-time updates simulation
  useEffect(() => {
    fetchTenants();
    const interval = setInterval(() => {
      fetchTenants();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Fetch tenants
  const fetchTenants = async () => {
    try {
      if (!loadingTenants) setRefreshing(true);
      const data = await mockTenantApi.list();
      setTenants(data?.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load tenants");
    } finally {
      setLoadingTenants(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  // Filter tenants
  useEffect(() => {
    let filtered = tenants;

    if (statusFilter !== "all") {
      filtered = filtered.filter((tenant) => tenant.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (tenant) =>
          tenant.tenant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTenants(filtered);
  }, [tenants, statusFilter, searchTerm]);

  // Statistics calculations
  const stats = {
    total: tenants.length,
    pending: tenants.filter((t) => t.status === "pending").length,
    approved: tenants.filter((t) => t.status === "approved").length,
    rejected: tenants.filter((t) => t.status === "rejected").length,
    recentRequests: tenants.filter((t) => {
      const created = new Date(t.created_at);
      const today = new Date();
      const diffTime = Math.abs(today - created);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length,
  };

  // Handle tenant actions
  const handleViewTenant = (tenant) => {
    setSelectedTenant(tenant);
    setDialogOpen(true);
  };

  const handleStatusUpdate = async (tenantId, newStatus) => {
    try {
      await mockTenantApi.updateStatus(tenantId, newStatus);
      fetchTenants();
    } catch (err) {
      setError("Failed to update tenant status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <PendingIcon />;
      case "approved":
        return <CheckCircleIcon />;
      case "rejected":
        return <CancelIcon />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          <DashboardIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Super Admin Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Welcome back, {user.name}! Monitor and manage tenant requests in
          real-time.
        </Typography>
      </Box>

      {/* Real-time indicator */}
      {refreshing && <LinearProgress sx={{ mb: 2 }} />}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Tenants
                  </Typography>
                </Box>
                <BusinessIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: 3,
      background: "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
      color: "white",
    }}
  >
    <CardContent>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Icon with badge */}
        <Badge
          badgeContent={stats.pending}
          color="error"
          overlap="circular"
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <PendingIcon sx={{ fontSize: 40, opacity: 0.9 }} />
        </Badge>
        

        {/* Stat Text */}
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {tenantRequestsCount}

          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Pending Requests
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
</Grid>


        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              background: "linear-gradient(135deg, #4caf50 0%, #81c784 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {stats.approved}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Tenants
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              background: "linear-gradient(135deg, #f44336 0%, #e57373 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {stats.rejected}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Rejected
                  </Typography>
                </Box>
                <CancelIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              background: "linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {stats.recentRequests}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    This Week
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Controls */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Tenants"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status Filter"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchTenants}
                disabled={refreshing}
              >
                Refresh
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary" align="center">
                Last updated: {new Date().toLocaleTimeString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label={`All Requests (${filteredTenants.length})`} />
          <Tab
            label={`Pending (${
              filteredTenants.filter((t) => t.status === "pending").length
            })`}
          />
          <Tab label="Recent Activity" />
          <Tab label="Analytics" />
        </Tabs>

        {/* Tab 1: All Requests */}
        <TabPanel value={currentTab} index={0}>
          {loadingTenants ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : filteredTenants.length === 0 ? (
            <Typography align="center" color="textSecondary" sx={{ p: 4 }}>
              No tenant requests found.
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Company</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Plan</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Requested</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTenants.map((tenant) => (
                    <TableRow key={tenant.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar sx={{ mr: 2, bgcolor: "#1976d2" }}>
                            {tenant.tenant_name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: "bold" }}
                            >
                              {tenant.tenant_name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {tenant.industry} • {tenant.company_size}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{tenant.email}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {tenant.phone}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tenant.subscription_plan}
                          size="small"
                          variant="outlined"
                          color={
                            tenant.subscription_plan === "Enterprise"
                              ? "primary"
                              : tenant.subscription_plan === "Premium"
                              ? "secondary"
                              : "default"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(tenant.status)}
                          label={tenant.status.toUpperCase()}
                          color={getStatusColor(tenant.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(tenant.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewTenant(tenant)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        {/* Tab 2: Pending Requests */}
        <TabPanel value={currentTab} index={1}>
          <Stack spacing={2}>
            {filteredTenants
              .filter((t) => t.status === "pending")
              .map((tenant) => (
                <Card
                  key={tenant.id}
                  sx={{ borderLeft: 4, borderLeftColor: "warning.main" }}
                >
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <Typography variant="h6">
                          {tenant.tenant_name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          gutterBottom
                        >
                          {tenant.email} • {tenant.phone}
                        </Typography>
                        <Typography variant="body2">
                          Requested: {formatDate(tenant.created_at)}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            label={tenant.subscription_plan}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Chip
                            label={`${tenant.estimated_users} users`}
                            size="small"
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Stack spacing={1} alignItems="flex-end">
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<CheckCircleIcon />}
                            onClick={() =>
                              handleStatusUpdate(tenant.id, "approved")
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<CancelIcon />}
                            onClick={() =>
                              handleStatusUpdate(tenant.id, "rejected")
                            }
                          >
                            Reject
                          </Button>
                          <Button
                            variant="text"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewTenant(tenant)}
                          >
                            View Details
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
          </Stack>
        </TabPanel>

        {/* Tab 3: Recent Activity */}
        <TabPanel value={currentTab} index={2}>
          <List>
            {tenants.slice(0, 10).map((tenant, index) => (
              <ListItem key={tenant.id}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor:
                        getStatusColor(tenant.status) === "success"
                          ? "#4caf50"
                          : getStatusColor(tenant.status) === "warning"
                          ? "#ff9800"
                          : "#f44336",
                    }}
                  >
                    {getStatusIcon(tenant.status)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${
                    tenant.tenant_name
                  } - ${tenant.status.toUpperCase()}`}
                  secondary={`${formatDate(tenant.created_at)} • ${
                    tenant.subscription_plan
                  } Plan`}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        {/* Tab 4: Analytics */}
        <TabPanel value={currentTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Request Trends
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Weekly request volume and approval rates
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#f5f5f5",
                  }}
                >
                  <Typography color="textSecondary">
                    Chart visualization would go here
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Industry Distribution
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Breakdown of tenant requests by industry
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#f5f5f5",
                  }}
                >
                  <Typography color="textSecondary">
                    Pie chart would go here
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Tenant Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            {selectedTenant?.tenant_name} - Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedTenant && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Contact Information
                    </Typography>
                    <Typography variant="body1">
                      {selectedTenant.email}
                    </Typography>
                    <Typography variant="body1">
                      {selectedTenant.phone}
                    </Typography>
                    <Typography variant="body1">
                      {selectedTenant.address}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Company Details
                    </Typography>
                    <Typography variant="body1">
                      Industry: {selectedTenant.industry}
                    </Typography>
                    <Typography variant="body1">
                      Size: {selectedTenant.company_size}
                    </Typography>
                    <Typography variant="body1">
                      Estimated Users: {selectedTenant.estimated_users}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Subscription
                    </Typography>
                    <Typography variant="body1">
                      {selectedTenant.subscription_plan}
                    </Typography>
                    <Chip
                      label={selectedTenant.status.toUpperCase()}
                      color={getStatusColor(selectedTenant.status)}
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Requested Features
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        mt: 1,
                      }}
                    >
                      {selectedTenant.requested_features?.map(
                        (feature, index) => (
                          <Chip
                            key={index}
                            label={feature}
                            size="small"
                            variant="outlined"
                          />
                        )
                      )}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Request Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(selectedTenant.created_at)}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          {selectedTenant?.status === "pending" && (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  handleStatusUpdate(selectedTenant.id, "approved");
                  setDialogOpen(false);
                }}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  handleStatusUpdate(selectedTenant.id, "rejected");
                  setDialogOpen(false);
                }}
              >
                Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuperAdminDashboard;
