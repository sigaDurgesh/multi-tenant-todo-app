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
import { TenantRequestContext } from "../../context/TenantRequestContext";

const SuperAdminDashboard = ({ navigate }) => {
  // Mock user context
    const { user } = useContext(AuthContext);

   const {totalPending, totalApproved , totalRejected , totalActive,totalCount,requestCounts} = useContext(TenantRequestContext)
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
      const res = await tenantApi.list(); 
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
                    {requestCounts.totalApproved}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Approved
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
                    {requestCounts.totalPending}
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
                    {requestCounts.totalRejected}
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



















// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Tabs,
//   Tab,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   Avatar,
//   IconButton,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Grid,
//   AppBar,
//   Toolbar,
//   Badge,
//   Switch,
//   FormControlLabel,
//   Alert,
//   LinearProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   InputAdornment,
//   ToggleButton,
//   ToggleButtonGroup,
//   ThemeProvider,
//   createTheme,
//   CssBaseline,
// } from "@mui/material";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   AreaChart,
//   Area,
// } from "recharts";
// import {
//   Users,
//   Building2,
//   TrendingUp,
//   Clock,
//   CheckCircle,
//   XCircle,
//   AlertTriangle,
//   Eye,
//   Search,
//   Filter,
//   RefreshCw,
//   Download,
//   Settings,
//   Bell,
//   Calendar,
//   DollarSign,
//   Server,
//   Activity,
//   Shield,
//   Globe,
//   Database,
//   Zap,
//   Mail,
//   Phone,
//   MapPin,
//   MoreVertical,
//   Edit,
//   Trash2,
//   Plus,
//   Star,
//   ArrowUp,
//   ArrowDown,
// } from "lucide-react";

// const SuperAdminDashboard = () => {
//   // State management
//   const [activeTab, setActiveTab] = useState(0);
//   const [tenants, setTenants] = useState([]);
//   const [selectedTenant, setSelectedTenant] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [realTimeData, setRealTimeData] = useState({});
//   const [filters, setFilters] = useState({
//     status: "all",
//     plan: "all",
//     industry: "all",
//     dateRange: "30",
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);

//   // Create Material-UI theme
//   const theme = createTheme({
//     palette: {
//       mode: darkMode ? "dark" : "light",
//       primary: {
//         main: "#1976d2",
//       },
//       secondary: {
//         main: "#dc004e",
//       },
//     },
//     components: {
//       MuiCard: {
//         styleOverrides: {
//           root: {
//             borderRadius: 12,
//             boxShadow:
//               "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//           },
//         },
//       },
//     },
//   });

//   // Mock data generator
//   const generateMockData = () => {
//     const companies = [
//       "TechCorp",
//       "DataFlow Inc",
//       "CloudSys",
//       "NextGen Solutions",
//       "DigitalHub",
//       "InnovateLabs",
//       "ScaleUp Co",
//       "FutureWorks",
//     ];
//     const industries = [
//       "Technology",
//       "Healthcare",
//       "Finance",
//       "Retail",
//       "Manufacturing",
//       "Education",
//       "Government",
//     ];
//     const plans = ["Starter", "Professional", "Enterprise", "Custom"];
//     const statuses = ["pending", "approved", "rejected", "active", "suspended"];

//     return Array.from({ length: 25 }, (_, i) => ({
//       id: i + 1,
//       tenant_name: `${
//         companies[Math.floor(Math.random() * companies.length)]
//       } ${i + 1}`,
//       email: `contact${i + 1}@example.com`,
//       phone: `+1-555-${Math.floor(Math.random() * 900) + 100}-${
//         Math.floor(Math.random() * 9000) + 1000
//       }`,
//       industry: industries[Math.floor(Math.random() * industries.length)],
//       subscription_plan: plans[Math.floor(Math.random() * plans.length)],
//       status: statuses[Math.floor(Math.random() * statuses.length)],
//       company_size: ["1-10", "11-50", "51-200", "201-1000", "1000+"][
//         Math.floor(Math.random() * 5)
//       ],
//       estimated_users: Math.floor(Math.random() * 1000) + 10,
//       monthly_revenue: Math.floor(Math.random() * 50000) + 1000,
//       storage_used: Math.floor(Math.random() * 100),
//       api_calls: Math.floor(Math.random() * 1000000),
//       created_at: new Date(
//         Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
//       ).toISOString(),
//       last_active: new Date(
//         Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
//       ).toISOString(),
//       location: ["New York", "San Francisco", "London", "Tokyo", "Sydney"][
//         Math.floor(Math.random() * 5)
//       ],
//       compliance_score: Math.floor(Math.random() * 40) + 60,
//       support_tickets: Math.floor(Math.random() * 10),
//       integrations: Math.floor(Math.random() * 8) + 1,
//     }));
//   };

//   // Initialize data
//   useEffect(() => {
//     const mockTenants = generateMockData();
//     setTenants(mockTenants);

//     // Generate notifications
//     setNotifications([
//       {
//         id: 1,
//         type: "warning",
//         message: "High API usage detected for TechCorp 1",
//         time: "2 min ago",
//       },
//       {
//         id: 2,
//         type: "success",
//         message: "New tenant approved: DataFlow Inc 3",
//         time: "15 min ago",
//       },
//       {
//         id: 3,
//         type: "info",
//         message: "Scheduled maintenance in 2 hours",
//         time: "1 hour ago",
//       },
//       {
//         id: 4,
//         type: "error",
//         message: "Payment failed for CloudSys 2",
//         time: "3 hours ago",
//       },
//     ]);

//     // Real-time updates simulation
//     const interval = setInterval(() => {
//       setRealTimeData({
//         activeUsers: Math.floor(Math.random() * 1000) + 500,
//         systemLoad: Math.floor(Math.random() * 100),
//         responseTime: Math.floor(Math.random() * 200) + 50,
//         uptime: 99.98,
//         timestamp: new Date().toLocaleTimeString(),
//       });
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   // Filter tenants
//   const filteredTenants = tenants.filter((tenant) => {
//     const matchesSearch =
//       tenant.tenant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       tenant.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus =
//       filters.status === "all" || tenant.status === filters.status;
//     const matchesPlan =
//       filters.plan === "all" || tenant.subscription_plan === filters.plan;
//     const matchesIndustry =
//       filters.industry === "all" || tenant.industry === filters.industry;

//     return matchesSearch && matchesStatus && matchesPlan && matchesIndustry;
//   });

//   // Statistics
//   const stats = {
//     total: tenants.length,
//     pending: tenants.filter((t) => t.status === "pending").length,
//     approved: tenants.filter((t) => t.status === "approved").length,
//     active: tenants.filter((t) => t.status === "active").length,
//     rejected: tenants.filter((t) => t.status === "rejected").length,
//     suspended: tenants.filter((t) => t.status === "suspended").length,
//     totalRevenue: tenants.reduce((sum, t) => sum + t.monthly_revenue, 0),
//     avgUsers: Math.floor(
//       tenants.reduce((sum, t) => sum + t.estimated_users, 0) / tenants.length
//     ),
//     totalApiCalls: tenants.reduce((sum, t) => sum + t.api_calls, 0),
//   };

//   // Chart data
//   const monthlyData = [
//     { month: "Jan", requests: 65, approved: 48, revenue: 125000 },
//     { month: "Feb", requests: 78, approved: 62, revenue: 145000 },
//     { month: "Mar", requests: 90, approved: 75, revenue: 168000 },
//     { month: "Apr", requests: 85, approved: 68, revenue: 155000 },
//     { month: "May", requests: 95, approved: 82, revenue: 178000 },
//     { month: "Jun", requests: 88, approved: 71, revenue: 162000 },
//   ];

//   const industryData = [
//     { name: "Technology", value: 35, color: "#0088FE" },
//     { name: "Healthcare", value: 25, color: "#00C49F" },
//     { name: "Finance", value: 20, color: "#FFBB28" },
//     { name: "Retail", value: 12, color: "#FF8042" },
//     { name: "Other", value: 8, color: "#8884d8" },
//   ];

//   const planDistribution = [
//     { plan: "Starter", count: 8, revenue: 24000 },
//     { plan: "Professional", count: 12, revenue: 84000 },
//     { plan: "Enterprise", count: 5, revenue: 125000 },
//     { plan: "Custom", count: 3, revenue: 75000 },
//   ];

//   // Action handlers
//   const handleStatusUpdate = (tenantId, newStatus) => {
//     setTenants((prev) =>
//       prev.map((t) => (t.id === tenantId ? { ...t, status: newStatus } : t))
//     );

//     // Add notification
//     const tenant = tenants.find((t) => t.id === tenantId);
//     setNotifications((prev) => [
//       {
//         id: Date.now(),
//         type: "success",
//         message: `${tenant.tenant_name} status updated to ${newStatus}`,
//         time: "Just now",
//       },
//       ...prev.slice(0, 9),
//     ]);
//   };

//   const exportData = () => {
//     const dataStr = JSON.stringify(filteredTenants, null, 2);
//     const dataBlob = new Blob([dataStr], { type: "application/json" });
//     const url = URL.createObjectURL(dataBlob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "tenant_data.json";
//     link.click();
//   };

//   // Get status color
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "active":
//         return "success";
//       case "pending":
//         return "warning";
//       case "approved":
//         return "info";
//       case "suspended":
//         return "secondary";
//       case "rejected":
//         return "error";
//       default:
//         return "default";
//     }
//   };

//   // Get plan color
//   const getPlanColor = (plan) => {
//     switch (plan) {
//       case "Enterprise":
//         return "secondary";
//       case "Professional":
//         return "primary";
//       case "Custom":
//         return "warning";
//       default:
//         return "default";
//     }
//   };

//   // Components
//   const StatCard = ({ title, value, icon: Icon, trend, color, subtitle }) => (
//     <Card sx={{ height: "100%" }}>
//       <CardContent>
//         <Box display="flex" alignItems="center" justifyContent="space-between">
//           <Box>
//             <Typography variant="body2" color="text.secondary" gutterBottom>
//               {title}
//             </Typography>
//             <Typography variant="h4" component="div" fontWeight="bold">
//               {value}
//             </Typography>
//             {subtitle && (
//               <Typography variant="caption" color="text.secondary">
//                 {subtitle}
//               </Typography>
//             )}
//           </Box>
//           <Avatar sx={{ bgcolor: `${color}.100`, color: `${color}.600` }}>
//             <Icon size={24} />
//           </Avatar>
//         </Box>
//         {trend && (
//           <Box display="flex" alignItems="center" mt={2}>
//             {trend > 0 ? (
//               <ArrowUp size={16} color="#4caf50" style={{ marginRight: 4 }} />
//             ) : (
//               <ArrowDown size={16} color="#f44336" style={{ marginRight: 4 }} />
//             )}
//             <Typography
//               variant="caption"
//               color={trend > 0 ? "success.main" : "error.main"}
//             >
//               {Math.abs(trend)}% vs last month
//             </Typography>
//           </Box>
//         )}
//       </CardContent>
//     </Card>
//   );

//   const NotificationPanel = () => (
//     <Card>
//       <CardContent>
//         <Box
//           display="flex"
//           alignItems="center"
//           justifyContent="space-between"
//           mb={2}
//         >
//           <Typography variant="h6" component="div">
//             Live Notifications
//           </Typography>
//           <Bell size={20} />
//         </Box>
//         <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
//           {notifications.map((notif) => (
//             <Alert
//               key={notif.id}
//               severity={
//                 notif.type === "warning"
//                   ? "warning"
//                   : notif.type === "success"
//                   ? "success"
//                   : notif.type === "error"
//                   ? "error"
//                   : "info"
//               }
//               sx={{ mb: 1 }}
//             >
//               <Typography variant="body2" fontWeight="medium">
//                 {notif.message}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 {notif.time}
//               </Typography>
//             </Alert>
//           ))}
//         </Box>
//       </CardContent>
//     </Card>
//   );

//   const SystemHealthPanel = () => (
//     <Card>
//       <CardContent>
//         <Typography variant="h6" gutterBottom>
//           System Health
//         </Typography>
//         <Box mb={3}>
//           <Box
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//             mb={1}
//           >
//             <Typography variant="body2" color="text.secondary">
//               CPU Usage
//             </Typography>
//             <Typography variant="body2" fontWeight="medium">
//               {realTimeData.systemLoad || 0}%
//             </Typography>
//           </Box>
//           <LinearProgress
//             variant="determinate"
//             value={realTimeData.systemLoad || 0}
//             sx={{ height: 8, borderRadius: 4 }}
//           />
//         </Box>

//         <Grid container spacing={2}>
//           <Grid item xs={6}>
//             <Card
//               sx={{
//                 bgcolor: "success.50",
//                 border: "1px solid",
//                 borderColor: "success.200",
//               }}
//             >
//               <CardContent sx={{ textAlign: "center", py: 2 }}>
//                 <Server size={24} color="#4caf50" style={{ marginBottom: 8 }} />
//                 <Typography variant="h5" fontWeight="bold" color="success.main">
//                   {realTimeData.uptime || 99.98}%
//                 </Typography>
//                 <Typography variant="caption" color="success.main">
//                   Uptime
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={6}>
//             <Card
//               sx={{
//                 bgcolor: "primary.50",
//                 border: "1px solid",
//                 borderColor: "primary.200",
//               }}
//             >
//               <CardContent sx={{ textAlign: "center", py: 2 }}>
//                 <Zap size={24} color="#1976d2" style={{ marginBottom: 8 }} />
//                 <Typography variant="h5" fontWeight="bold" color="primary.main">
//                   {realTimeData.responseTime || 125}ms
//                 </Typography>
//                 <Typography variant="caption" color="primary.main">
//                   Response Time
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </CardContent>
//     </Card>
//   );

//   // Initialize with mock data
//   useEffect(() => {
//     setTenants(generateMockData());
//   }, []);

//   if (loading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         minHeight="100vh"
//       >
//         <Box sx={{ width: "100px" }}>
//           <LinearProgress />
//         </Box>
//       </Box>
//     );
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
//         {/* Header */}
//         <AppBar position="sticky" elevation={1}>
//           <Toolbar>
//             <Box
//               display="flex"
//               alignItems="center"
//               justifyContent="space-between"
//               width="100%"
//             >
//               <Box>
//                 <Typography variant="h5" component="div" fontWeight="bold">
//                   Super Admin Dashboard
//                 </Typography>
//                 <Typography variant="body2" color="rgba(255,255,255,0.7)">
//                   Comprehensive tenant management and analytics
//                 </Typography>
//               </Box>
//               <Box display="flex" alignItems="center" gap={2}>
//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={darkMode}
//                       onChange={() => setDarkMode(!darkMode)}
//                       color="default"
//                     />
//                   }
//                   label={darkMode ? "🌙" : "☀️"}
//                 />
//                 <Badge badgeContent={notifications.length} color="error">
//                   <IconButton color="inherit">
//                     <Bell size={20} />
//                   </IconButton>
//                 </Badge>
//                 <Box display="flex" alignItems="center" gap={1}>
//                   <Avatar
//                     sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}
//                   >
//                     SA
//                   </Avatar>
//                   <Typography variant="body2">Super Admin</Typography>
//                 </Box>
//               </Box>
//             </Box>
//           </Toolbar>
//         </AppBar>

//         {/* Navigation Tabs */}
//         <Box
//           sx={{
//             borderBottom: 1,
//             borderColor: "divider",
//             bgcolor: "background.paper",
//           }}
//         >
//           <Tabs
//             value={activeTab}
//             onChange={(e, newValue) => setActiveTab(newValue)}
//             sx={{ px: 3 }}
//           >
//             <Tab icon={<Activity size={20} />} label="Overview" />
//             <Tab icon={<Building2 size={20} />} label="Tenants" />
//             <Tab icon={<TrendingUp size={20} />} label="Analytics" />
//             <Tab icon={<Server size={20} />} label="System" />
//             <Tab icon={<Settings size={20} />} label="Settings" />
//           </Tabs>
//         </Box>

//         <Box p={3}>
//           {/* Overview Tab */}
//           {activeTab === 0 && (
//             <Box>
//               {/* Key Metrics */}
//               <Grid container spacing={3} mb={3}>
//                 <Grid item xs={12} sm={6} lg={3}>
//                   <StatCard
//                     title="Total Tenants"
//                     value={stats.total}
//                     icon={Building2}
//                     trend={8.2}
//                     color="primary"
//                     subtitle={`${stats.active} active`}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6} lg={3}>
//                   <StatCard
//                     title="Pending Requests"
//                     value={stats.pending}
//                     icon={Clock}
//                     trend={-15.3}
//                     color="warning"
//                     subtitle="Requires attention"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6} lg={3}>
//                   <StatCard
//                     title="Monthly Revenue"
//                     value={`$${(stats.totalRevenue / 1000).toFixed(0)}K`}
//                     icon={DollarSign}
//                     trend={12.8}
//                     color="success"
//                     subtitle="This month"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6} lg={3}>
//                   <StatCard
//                     title="Active Users"
//                     value={realTimeData.activeUsers || 742}
//                     icon={Users}
//                     trend={5.4}
//                     color="secondary"
//                     subtitle="Right now"
//                   />
//                 </Grid>
//               </Grid>

//               {/* Charts Row */}
//               <Grid container spacing={3} mb={3}>
//                 {/* Monthly Trends */}
//                 <Grid item xs={12} lg={6}>
//                   <Card>
//                     <CardContent>
//                       <Typography variant="h6" gutterBottom>
//                         Monthly Trends
//                       </Typography>
//                       <ResponsiveContainer width="100%" height={300}>
//                         <AreaChart data={monthlyData}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="month" />
//                           <YAxis />
//                           <Tooltip />
//                           <Area
//                             type="monotone"
//                             dataKey="requests"
//                             stackId="1"
//                             stroke="#8884d8"
//                             fill="#8884d8"
//                             fillOpacity={0.6}
//                           />
//                           <Area
//                             type="monotone"
//                             dataKey="approved"
//                             stackId="1"
//                             stroke="#82ca9d"
//                             fill="#82ca9d"
//                             fillOpacity={0.6}
//                           />
//                         </AreaChart>
//                       </ResponsiveContainer>
//                     </CardContent>
//                   </Card>
//                 </Grid>

//                 {/* Industry Distribution */}
//                 <Grid item xs={12} lg={6}>
//                   <Card>
//                     <CardContent>
//                       <Typography variant="h6" gutterBottom>
//                         Industry Distribution
//                       </Typography>
//                       <ResponsiveContainer width="100%" height={300}>
//                         <PieChart>
//                           <Pie
//                             data={industryData}
//                             cx="50%"
//                             cy="50%"
//                             outerRadius={100}
//                             fill="#8884d8"
//                             dataKey="value"
//                             label={({ name, percent }) =>
//                               `${name} ${(percent * 100).toFixed(0)}%`
//                             }
//                           >
//                             {industryData.map((entry, index) => (
//                               <Cell key={`cell-${index}`} fill={entry.color} />
//                             ))}
//                           </Pie>
//                           <Tooltip />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               </Grid>

//               {/* Bottom Row */}
//               <Grid container spacing={3}>
//                 <Grid item xs={12} lg={4}>
//                   <NotificationPanel />
//                 </Grid>
//                 <Grid item xs={12} lg={4}>
//                   <SystemHealthPanel />
//                 </Grid>

//                 {/* Quick Actions */}
//                 <Grid item xs={12} lg={4}>
//                   <Card>
//                     <CardContent>
//                       <Typography variant="h6" gutterBottom>
//                         Quick Actions
//                       </Typography>
//                       <Box display="flex" flexDirection="column" gap={2}>
//                         <Button
//                           variant="contained"
//                           fullWidth
//                           startIcon={<Plus size={16} />}
//                           sx={{ py: 1.5 }}
//                         >
//                           Add New Tenant
//                         </Button>
//                         <Button
//                           variant="contained"
//                           color="success"
//                           fullWidth
//                           startIcon={<Download size={16} />}
//                           onClick={exportData}
//                           sx={{ py: 1.5 }}
//                         >
//                           Export Data
//                         </Button>
//                         <Button
//                           variant="contained"
//                           color="secondary"
//                           fullWidth
//                           startIcon={<Settings size={16} />}
//                           sx={{ py: 1.5 }}
//                         >
//                           System Settings
//                         </Button>
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               </Grid>
//             </Box>
//           )}

//           {/* Tenants Tab */}
//           {activeTab === 1 && (
//             <Box>
//               {/* Filters */}
//               <Card sx={{ mb: 3 }}>
//                 <CardContent>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} md={4}>
//                       <TextField
//                         fullWidth
//                         placeholder="Search tenants..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         InputProps={{
//                           startAdornment: (
//                             <InputAdornment position="start">
//                               <Search size={20} />
//                             </InputAdornment>
//                           ),
//                         }}
//                       />
//                     </Grid>

//                     <Grid item xs={12} md={2}>
//                       <FormControl fullWidth>
//                         <InputLabel>Status</InputLabel>
//                         <Select
//                           value={filters.status}
//                           label="Status"
//                           onChange={(e) =>
//                             setFilters({ ...filters, status: e.target.value })
//                           }
//                         >
//                           <MenuItem value="all">All Status</MenuItem>
//                           <MenuItem value="pending">Pending</MenuItem>
//                           <MenuItem value="approved">Approved</MenuItem>
//                           <MenuItem value="active">Active</MenuItem>
//                           <MenuItem value="suspended">Suspended</MenuItem>
//                           <MenuItem value="rejected">Rejected</MenuItem>
//                         </Select>
//                       </FormControl>
//                     </Grid>

//                     <Grid item xs={12} md={2}>
//                       <FormControl fullWidth>
//                         <InputLabel>Plan</InputLabel>
//                         <Select
//                           value={filters.plan}
//                           label="Plan"
//                           onChange={(e) =>
//                             setFilters({ ...filters, plan: e.target.value })
//                           }
//                         >
//                           <MenuItem value="all">All Plans</MenuItem>
//                           <MenuItem value="Starter">Starter</MenuItem>
//                           <MenuItem value="Professional">Professional</MenuItem>
//                           <MenuItem value="Enterprise">Enterprise</MenuItem>
//                           <MenuItem value="Custom">Custom</MenuItem>
//                         </Select>
//                       </FormControl>
//                     </Grid>

//                     <Grid item xs={12} md={2}>
//                       <FormControl fullWidth>
//                         <InputLabel>Industry</InputLabel>
//                         <Select
//                           value={filters.industry}
//                           label="Industry"
//                           onChange={(e) =>
//                             setFilters({ ...filters, industry: e.target.value })
//                           }
//                         >
//                           <MenuItem value="all">All Industries</MenuItem>
//                           <MenuItem value="Technology">Technology</MenuItem>
//                           <MenuItem value="Healthcare">Healthcare</MenuItem>
//                           <MenuItem value="Finance">Finance</MenuItem>
//                           <MenuItem value="Retail">Retail</MenuItem>
//                           <MenuItem value="Manufacturing">
//                             Manufacturing
//                           </MenuItem>
//                           <MenuItem value="Education">Education</MenuItem>
//                           <MenuItem value="Government">Government</MenuItem>
//                         </Select>
//                       </FormControl>
//                     </Grid>

//                     <Grid item xs={12} md={2}>
//                       <Button
//                         variant="contained"
//                         fullWidth
//                         startIcon={<Download size={16} />}
//                         onClick={exportData}
//                         sx={{ height: 56 }}
//                       >
//                         Export
//                       </Button>
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Card>

//               {/* Tenants Table */}
//               <Card>
//                 <TableContainer>
//                   <Table>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Company</TableCell>
//                         <TableCell>Contact</TableCell>
//                         <TableCell>Plan & Usage</TableCell>
//                         <TableCell>Status</TableCell>
//                         <TableCell>Revenue</TableCell>
//                         <TableCell align="right">Actions</TableCell>
//                       </TableRow>
//                     </TableHead>

//                     <TableBody>
//                       {filteredTenants.map((tenant) => (
//                         <TableRow key={tenant.id} hover>
//                           {/* Company */}
//                           <TableCell>
//                             <Box display="flex" alignItems="center">
//                               <Avatar
//                                 sx={{
//                                   mr: 2,
//                                   bgcolor: "primary.main",
//                                   background:
//                                     "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)",
//                                 }}
//                               >
//                                 {tenant.tenant_name?.charAt(0)}
//                               </Avatar>
//                               <Box>
//                                 <Typography
//                                   variant="subtitle2"
//                                   fontWeight="medium"
//                                 >
//                                   {tenant.tenant_name}
//                                 </Typography>
//                                 <Typography
//                                   variant="caption"
//                                   color="text.secondary"
//                                 >
//                                   {tenant.industry} • {tenant.company_size}
//                                 </Typography>
//                               </Box>
//                             </Box>
//                           </TableCell>

//                           {/* Contact */}
//                           <TableCell>
//                             <Box>
//                               <Typography variant="body2">
//                                 {tenant.email}
//                               </Typography>
//                               <Typography
//                                 variant="caption"
//                                 color="text.secondary"
//                               >
//                                 {tenant.phone}
//                               </Typography>
//                               <Typography
//                                 variant="caption"
//                                 color="text.secondary"
//                                 display="block"
//                               >
//                                 📍 {tenant.location}
//                               </Typography>
//                             </Box>
//                           </TableCell>

//                           {/* Plan & Usage */}
//                           <TableCell>
//                             <Box>
//                               <Chip
//                                 label={tenant.subscription_plan}
//                                 color={getPlanColor(tenant.subscription_plan)}
//                                 size="small"
//                                 sx={{ mb: 1 }}
//                               />
//                               <Typography
//                                 variant="caption"
//                                 color="text.secondary"
//                                 display="block"
//                               >
//                                 {tenant.estimated_users} users •{" "}
//                                 {tenant.storage_used}% storage
//                               </Typography>
//                               <Typography
//                                 variant="caption"
//                                 color="text.secondary"
//                                 display="block"
//                               >
//                                 {(tenant.api_calls / 1000).toFixed(0)}K API
//                                 calls
//                               </Typography>
//                             </Box>
//                           </TableCell>

//                           {/* Status */}
//                           <TableCell>
//                             <Chip
//                               label={
//                                 tenant.status.charAt(0).toUpperCase() +
//                                 tenant.status.slice(1)
//                               }
//                               color={getStatusColor(tenant.status)}
//                               size="small"
//                               icon={
//                                 tenant.status === "active" ? (
//                                   <CheckCircle size={16} />
//                                 ) : tenant.status === "pending" ? (
//                                   <Clock size={16} />
//                                 ) : tenant.status === "rejected" ? (
//                                   <XCircle size={16} />
//                                 ) : null
//                               }
//                             />
//                           </TableCell>

//                           {/* Revenue */}
//                           <TableCell>
//                             <Typography variant="body2">
//                               ${tenant.revenue}
//                             </Typography>
//                           </TableCell>

//                           {/* Actions */}
//                           <TableCell align="right">
//                             {/* Place your action buttons here */}
//                             <Button size="small" variant="outlined">
//                               View
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </Card>
//             </Box>
//           )}
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default SuperAdminDashboard;
