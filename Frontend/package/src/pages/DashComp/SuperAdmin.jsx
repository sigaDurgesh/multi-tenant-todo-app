import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  CircularProgress,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tabs,
  Tab,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { format } from "date-fns";

import { tenantApi } from "../../services/tenantAdminAPI";

const SuperAdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return isNaN(d) ? "-" : format(d, "MMM dd, yyyy HH:mm");
  };

  const fetchTenants = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await tenantApi.list();
      setTenants(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTenants();
    const interval = setInterval(fetchTenants, 100000);
    return () => clearInterval(interval);
  }, [fetchTenants]);

  const filteredTenants = tenants.filter(
    (t) =>
      (statusFilter === "all" || t.status === statusFilter) &&
      (t.tenant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.requester.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  const handleStatusUpdate = async (tenantId, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus} this tenant?`))
      return;
    try {
      await tenantApi.updateStatus(tenantId, newStatus);
      setSnackbar({
        open: true,
        message: `Tenant ${newStatus}`,
        severity: "success",
      });
      fetchTenants();
    } catch (err) {
      setSnackbar({ open: true, message: "Update failed", severity: "error" });
    }
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );

  const totalApproved = tenants.filter((t) => t.status === "approved").length;
  const totalPending = tenants.filter((t) => t.status === "pending").length;
  const totalRejected = tenants.filter((t) => t.status === "rejected").length;

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2" }}>
          <DashboardIcon sx={{ mr: 1 }} />
          Super Admin Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Welcome back, {user?.name || "Admin"}! Monitor tenant requests in
          real-time.
        </Typography>
      </Box>

      {refreshing && <LinearProgress sx={{ mb: 2 }} />}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              background: "linear-gradient(135deg, #4caf50, #81c784)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography variant="h5">Total Tenants</Typography>
              <Typography variant="h3">{tenants.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              background: "linear-gradient(135deg, #1976d2, #42a5f5)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography variant="h5">Approved</Typography>
              <Typography variant="h3">{totalApproved}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              background: "linear-gradient(135deg, #ff9800, #ffb74d)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography variant="h5">Pending</Typography>
              <Typography variant="h3">{totalPending}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              background: "linear-gradient(135deg, #f44336, #e57373)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography variant="h5">Rejected</Typography>
              <Typography variant="h3">{totalRejected}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                 
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<RefreshIcon />}
              onClick={fetchTenants}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Tabs */}
      <Card sx={{ borderRadius: 3, p: 2 }}>
        <Tabs
          value={currentTab}
          onChange={(e, val) => setCurrentTab(val)}
          variant="fullWidth"
        >
          <Tab label={`All (${tenants.length})`} />
          <Tab label={`Pending (${totalPending})`} />
          <Tab label="Recent Activity" />
          <Tab label="Analytics" />
        </Tabs>

        {/* All Requests */}
        <TabPanel value={currentTab} index={0}>
          {loading ? (
            <CircularProgress />
          ) : filteredTenants.length === 0 ? (
            <Typography>No tenants found.</Typography>
          ) : (
            <List>
              {filteredTenants.map((t) => (
                <ListItem
                  key={t.id}
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      {t.status === "pending" && (
                        <span style={{ color: "orange" }}>Pending </span>
                      )}
                      {t.status === "approved" && (
                        <span style={{ color: "green" }}>Approved</span>
                      )}
                      {t.status === "rejected" && (
                        <span style={{ color: "red" }}>Rejected</span>
                      )}

                      <IconButton
                        onClick={() => {
                          setSelectedTenant(t);
                          setDialogOpen(true);
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getStatusColor(t.status) }}>
                      {getStatusIcon(t.status)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={t.tenant_name || "-"}
                    secondary={`${t.requester?.email || "-"} — ${
                      t.requested_at ? formatDate(t.requested_at) : "-"
                    }`}
                    // Reviewed by: ${t.reviewer?.email || "-"}
                    //                <div><strong>Reviewed by:</strong> {t.reviewer?.email || "-"}</div>
                    // <div><strong>Reviewed at:</strong> {t.reviewed_at ? formatDate(t.reviewed_at) : "-"}</div>
                    // • Requested: ${formatDate(t.requested_at)} • Reviewed: ${formatDate(t.reviewed_at)} • Reviewer: ${t.reviewer?.email || "-"}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>

        {/* Pending Requests */}
        <TabPanel value={currentTab} index={1}>
          <List>
            {tenants
              .filter((t) => t.status === "pending")
              .map((t) => (
                <ListItem
                  key={t.id}
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      {t.status === "pending" && (
                        <span style={{ color: "orange" }}>Pending </span>
                      )}
                      <IconButton
                        onClick={() => {
                          setSelectedTenant(t);
                          setDialogOpen(true);
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getStatusColor(t.status) }}>
                      {getStatusIcon(t.status)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={t.tenant_name || "-"}
                    secondary={`${t.requester?.email || "-"} — ${
                      t.requested_at ? formatDate(t.requested_at) : "-"
                    }`}
                  />
                </ListItem>
              ))}
          </List>
        </TabPanel>

        {/* Recent Activity */}
       <TabPanel value={currentTab} index={2}>
  {tenants && tenants.length > 0 ? (
    <List>
      {tenants
        .slice()
        .sort((a, b) => new Date(b.reviewed_at) - new Date(a.reviewed_at)) // recent first
        .map((t) => (
          <ListItem
            key={t.id}
            sx={{
              borderBottom: "1px solid #f0f0f0",
              alignItems: "flex-start",
              py: 2,
            }}
          >
            {/* Status Avatar */}
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: getStatusColor(t.status) }}>
                {getStatusIcon(t.status)}
              </Avatar>
            </ListItemAvatar>

            {/* Tenant Info */}
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight={600}>
                  {t.tenant_name || "Unnamed Tenant"}{" "}
                  <Chip
                    label={t.status?.toUpperCase() || "UNKNOWN"}
                    size="small"
                    sx={{
                      ml: 1,
                      fontSize: "0.7rem",
                      fontWeight: "bold",
                      bgcolor: getStatusColor(t.status),
                      color: "#fff",
                    }}
                  />
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Requested By:</strong>{" "}
                    {t.requester?.email || "-"} •{" "}
                    {t.requested_at ? formatDate(t.requested_at) : "N/A"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Reviewed:</strong>{" "}
                    {t.reviewed_at ? formatDate(t.reviewed_at) : "Pending"} •{" "}
                    <strong>Reviewer:</strong>{" "}
                    {t.reviewer?.email || "Not Assigned"}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
    </List>
  ) : (
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ textAlign: "center", mt: 3 }}
    >
      No tenants reviewed yet.
    </Typography>
  )}
</TabPanel>


        {/* Analytics */}
        <TabPanel value={currentTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6">Request Trends</Typography>
                <Typography variant="body2" color="textSecondary">
                  Weekly request volume
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
                    Chart Placeholder
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6">Status Distribution</Typography>
                <Typography variant="body2" color="textSecondary">
                  Approved / Pending / Rejected
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
                    Chart Placeholder
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Tenant Details Modal */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedTenant?.tenant_name || "-"}</DialogTitle>
        <DialogContent>
          {selectedTenant && (
            <Stack spacing={1}>
              <Typography>
                Tenant Name: {selectedTenant.tenant_name || "-"}
              </Typography>
              <Typography>
                Requester Email: {selectedTenant.requester.email || "-"}
              </Typography>
              <Typography>
                Requested At: {formatDate(selectedTenant.requested_at)}
              </Typography>
              <Typography>
                Status: {selectedTenant.status.toUpperCase()}
              </Typography>
              {/* <Typography>
                Reviewed At: {formatDate(selectedTenant.reviewed_at)}
              </Typography>
              <Typography>
                Reviewer Email: {selectedTenant.reviewer?.email || "-"}
                
              </Typography> */}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          {/* {selectedTenant?.status==="pending" && <>
            <Button variant="contained" color="success" onClick={()=>{handleStatusUpdate(selectedTenant.id,"approved"); setDialogOpen(false)}}>Approve</Button>
            <Button variant="contained" color="error" onClick={()=>{handleStatusUpdate(selectedTenant.id,"rejected"); setDialogOpen(false)}}>Reject</Button>
          </>} */}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default SuperAdminDashboard;







// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   CircularProgress,
//   Chip,
//   Avatar,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Alert,
//   Tabs,
//   Tab,
//   LinearProgress,
//   Tooltip,
//   Badge,
//   Stack,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   ListItemAvatar,
//   AppBar,
//   Toolbar,
//   Menu,
//   Divider,
//   Snackbar,
//   TablePagination,
//   Checkbox,
//   FormGroup,
//   FormControlLabel,
//   Switch,
//   CardActions,
//   Collapse,
//   Fab,
//   SpeedDial,
//   SpeedDialAction,
//   SpeedDialIcon,
//   Breadcrumbs,
//   Link,
//   Container,
//   useTheme,
//   alpha
// } from '@mui/material';
// import {
//   Dashboard as DashboardIcon,
//   Business as BusinessIcon,
//   People as PeopleIcon,
//   TrendingUp as TrendingUpIcon,
//   AccessTime as AccessTimeIcon,
//   CheckCircle as CheckCircleIcon,
//   Cancel as CancelIcon,
//   Pending as PendingIcon,
//   Visibility as VisibilityIcon,
//   FilterList as FilterListIcon,
//   Refresh as RefreshIcon,
//   Notifications as NotificationsIcon,
//   ExpandMore as ExpandMoreIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   LocationOn as LocationOnIcon,
//   CalendarToday as CalendarTodayIcon,
//   AttachMoney as AttachMoneyIcon,
//   Storage as StorageIcon,
//   CloudUpload as CloudUploadIcon,
//   NoteAdd as NoteAddIcon,
//   Search as SearchIcon,
//   Download as DownloadIcon,
//   Upload as UploadIcon,
//   Settings as SettingsIcon,
//   MoreVert as MoreVertIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   FileUpload as FileUploadIcon,
//   Assignment as AssignmentIcon,
//   Analytics as AnalyticsIcon,
//   Security as SecurityIcon,
//   Group as GroupIcon,
//   Domain as DomainIcon,
//   Timeline as TimelineIcon,
//   PieChart as PieChartIcon,
//   BarChart as BarChartIcon,
//   Home as HomeIcon,
//   ChevronRight as ChevronRightIcon,
//   Warning as WarningIcon,
//   Info as InfoIcon,
//   Close as CloseIcon,
//   Add as AddIcon,
//   Send as SendIcon
// } from '@mui/icons-material';

// // Mock API Service
// const tenantApi = {
//   list: async (params = {}) => {
//     // Simulate API delay
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     const mockData = [
//       {
//         id: 1,
//         tenant_name: "TechCorp Solutions",
//         email: "admin@techcorp.com",
//         phone: "+1-555-0123",
//         address: "123 Tech Street, Silicon Valley, CA 94025",
//         industry: "Technology",
//         company_size: "100-500",
//         estimated_users: 150,
//         subscription_plan: "Enterprise",
//         status: "pending",
//         created_at: "2024-12-15T10:30:00Z",
//         updated_at: "2024-12-15T10:30:00Z",
//         requested_features: ["Multi-tenant", "API Access", "Custom Branding"],
//         monthly_budget: 5000,
//         contact_person: "John Smith",
//         website: "https://techcorp.com",
//         tax_id: "123-456-789",
//         priority: "high"
//       },
//       {
//         id: 2,
//         tenant_name: "Global Manufacturing Inc",
//         email: "it@globalmanuf.com",
//         phone: "+1-555-0124",
//         address: "456 Industrial Blvd, Detroit, MI 48201",
//         industry: "Manufacturing",
//         company_size: "500+",
//         estimated_users: 300,
//         subscription_plan: "Premium",
//         status: "approved",
//         created_at: "2024-12-14T15:45:00Z",
//         updated_at: "2024-12-16T09:20:00Z",
//         requested_features: ["Inventory Management", "Analytics", "Mobile App"],
//         monthly_budget: 3000,
//         contact_person: "Sarah Johnson",
//         website: "https://globalmanuf.com",
//         tax_id: "987-654-321",
//         priority: "medium"
//       },
//       {
//         id: 3,
//         tenant_name: "HealthCare Plus",
//         email: "admin@healthcareplus.com",
//         phone: "+1-555-0125",
//         address: "789 Medical Center Dr, Boston, MA 02115",
//         industry: "Healthcare",
//         company_size: "50-100",
//         estimated_users: 75,
//         subscription_plan: "Standard",
//         status: "rejected",
//         created_at: "2024-12-13T08:15:00Z",
//         updated_at: "2024-12-14T16:30:00Z",
//         requested_features: ["HIPAA Compliance", "Patient Portal", "Reporting"],
//         monthly_budget: 1500,
//         contact_person: "Dr. Michael Brown",
//         website: "https://healthcareplus.com",
//         tax_id: "456-789-123",
//         priority: "low",
//         rejection_reason: "Incomplete documentation"
//       },
//       {
//         id: 4,
//         tenant_name: "EduLearn Platform",
//         email: "contact@edulearn.edu",
//         phone: "+1-555-0126",
//         address: "321 University Ave, Stanford, CA 94305",
//         industry: "Education",
//         company_size: "10-50",
//         estimated_users: 500,
//         subscription_plan: "Enterprise",
//         status: "pending",
//         created_at: "2024-12-16T11:00:00Z",
//         updated_at: "2024-12-16T11:00:00Z",
//         requested_features: ["LMS Integration", "Video Streaming", "Assessment Tools"],
//         monthly_budget: 2000,
//         contact_person: "Prof. Lisa Davis",
//         website: "https://edulearn.edu",
//         tax_id: "789-123-456",
//         priority: "high"
//       },
//       {
//         id: 5,
//         tenant_name: "RetailMax Chain",
//         email: "tech@retailmax.com",
//         phone: "+1-555-0127",
//         address: "555 Commerce St, New York, NY 10001",
//         industry: "Retail",
//         company_size: "500+",
//         estimated_users: 200,
//         subscription_plan: "Premium",
//         status: "approved",
//         created_at: "2024-12-12T14:20:00Z",
//         updated_at: "2024-12-15T10:45:00Z",
//         requested_features: ["POS Integration", "Inventory", "Customer Analytics"],
//         monthly_budget: 4000,
//         contact_person: "Alex Wilson",
//         website: "https://retailmax.com",
//         tax_id: "321-654-987",
//         priority: "medium"
//       }
//     ];

//     // Apply filters
//     let filtered = [...mockData];
//     if (params.status && params.status !== 'all') {
//       filtered = filtered.filter(item => item.status === params.status);
//     }
//     if (params.search) {
//       const searchLower = params.search.toLowerCase();
//       filtered = filtered.filter(item =>
//         item.tenant_name.toLowerCase().includes(searchLower) ||
//         item.email.toLowerCase().includes(searchLower) ||
//         item.industry.toLowerCase().includes(searchLower)
//       );
//     }

//     return {
//       data: filtered,
//       total: filtered.length,
//       page: params.page || 1,
//       limit: params.limit || 10
//     };
//   },

//   updateStatus: async (id, status, reason = '') => {
//     await new Promise(resolve => setTimeout(resolve, 500));
//     console.log(`Updating tenant ${id} to ${status}`, reason);
//     return { success: true };
//   },

//   bulkUpdate: async (ids, status) => {
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     console.log(`Bulk updating tenants ${ids.join(', ')} to ${status}`);
//     return { success: true };
//   },

//   exportData: async (format = 'csv') => {
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     console.log(`Exporting data in ${format} format`);
//     return { success: true, downloadUrl: '#' };
//   }
// };

// const SuperAdminDashboard = () => {
//   const theme = useTheme();

//   // Enhanced State Management
//   const [tenants, setTenants] = useState([]);
//   const [filteredTenants, setFilteredTenants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedTenant, setSelectedTenant] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [currentTab, setCurrentTab] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [industryFilter, setIndustryFilter] = useState('all');
//   const [priorityFilter, setPriorityFilter] = useState('all');
//   const [sortBy, setSortBy] = useState('created_at');

//   // New advanced states
//   const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
//   const [fullscreen, setFullscreen] = useState(false);
//   const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
//   const [analytics, setAnalytics] = useState(null);
//   const [systemHealth, setSystemHealth] = useState(null);
//   const [assignDialog, setAssignDialog] = useState({ open: false, tenant: null });
//   const [noteDialog, setNoteDialog] = useState({ open: false, tenant: null });
//   const [newNote, setNewNote] = useState('');
//   const [selectedAssignee, setSelectedAssignee] = useState('');
//   const [exportDialog, setExportDialog] = useState({ open: false, format: 'csv' });
//   const [notificationDialog, setNotificationDialog] = useState({ open: false, type: 'email' });
//   const [notificationMessage, setNotificationMessage] = useState('');
//   const [compactMode, setCompactMode] = useState(false);
//   const [showArchivedTenants, setShowArchivedTenants] = useState(false);
//   const [favoritesTenants, setFavoritesTenants] = useState([]);
//   const [recentActivity, setRecentActivity] = useState([]);
//   const [onlineStatus, setOnlineStatus] = useState(true);
//   const [sortOrder, setSortOrder] = useState('desc');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [selectedTenants, setSelectedTenants] = useState([]);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [bulkActionAnchor, setBulkActionAnchor] = useState(null);
//   const [autoRefresh, setAutoRefresh] = useState(true);
//   const [expandedCard, setExpandedCard] = useState(null);
//   const [actionDialog, setActionDialog] = useState({ open: false, type: '', tenant: null });
//   const [actionReason, setActionReason] = useState('');

//   // Statistics
//  const stats = React.useMemo(() => {
//   if (!Array.isArray(tenants)) return {
//     total: 0,
//     pending: 0,
//     approved: 0,
//     rejected: 0,
//     thisWeek: 0,
//     highPriority: 0
//   };

//   const total = tenants.length;
//   const pending = tenants.filter(t => t.status === 'pending').length;
//   const approved = tenants.filter(t => t.status === 'approved').length;
//   const rejected = tenants.filter(t => t.status === 'rejected').length;

//   const weekAgo = new Date();
//   weekAgo.setDate(weekAgo.getDate() - 7);

//   const thisWeek = tenants.filter(t => {
//     const created = new Date(t.created_at);
//     return created > weekAgo;
//   }).length;

//   const highPriority = tenants.filter(t => t.priority === 'high').length;

//   return { total, pending, approved, rejected, thisWeek, highPriority };
// }, [tenants]);

//   // Fetch tenants with error handling and retry logic
//   const fetchTenants = useCallback(async (showLoading = true) => {
//     try {
//       if (showLoading && !refreshing) setLoading(true);
//       if (!showLoading) setRefreshing(true);

//       const params = {
//         search: searchTerm,
//         status: statusFilter,
//         sortBy,
//         sortOrder,
//         page: page + 1,
//         limit: rowsPerPage
//       };

//       const response = await tenantApi.list(params);
//       setTenants(response.data);
//       setError(null);

//       if (!showLoading) {
//         showSnackbar('Data refreshed successfully', 'success');
//       }
//     } catch (err) {
//       console.error('Failed to fetch tenants:', err);
//       setError(err.message || 'Failed to load tenant data');
//       showSnackbar('Failed to load data', 'error');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [searchTerm, statusFilter, sortBy, sortOrder, page, rowsPerPage, refreshing]);

//   // Auto-refresh functionality
//   useEffect(() => {
//     fetchTenants();
//   }, [fetchTenants]);

//   useEffect(() => {
//     let interval;
//     if (autoRefresh) {
//       interval = setInterval(() => {
//         fetchTenants(false);
//       }, 30000); // Refresh every 30 seconds
//     }
//     return () => clearInterval(interval);
//   }, [autoRefresh, fetchTenants]);

//   // Filter tenants based on search and status
//   useEffect(() => {
//     let filtered = [...tenants];

//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(tenant => tenant.status === statusFilter);
//     }

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = filtered.filter(tenant =>
//         tenant.tenant_name.toLowerCase().includes(searchLower) ||
//         tenant.email.toLowerCase().includes(searchLower) ||
//         tenant.industry.toLowerCase().includes(searchLower) ||
//         tenant.contact_person.toLowerCase().includes(searchLower)
//       );
//     }

//     // Sort tenants
//     filtered.sort((a, b) => {
//       const aVal = a[sortBy];
//       const bVal = b[sortBy];

//       if (sortOrder === 'asc') {
//         return aVal > bVal ? 1 : -1;
//       } else {
//         return aVal < bVal ? 1 : -1;
//       }
//     });

//     setFilteredTenants(filtered);
//   }, [tenants, searchTerm, statusFilter, sortBy, sortOrder]);

//   // Utility functions
//   const showSnackbar = (message, severity = 'success') => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'warning';
//       case 'approved': return 'success';
//       case 'rejected': return 'error';
//       default: return 'default';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'pending': return <PendingIcon />;
//       case 'approved': return <CheckCircleIcon />;
//       case 'rejected': return <CancelIcon />;
//       default: return null;
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high': return '#f44336';
//       case 'medium': return '#ff9800';
//       case 'low': return '#4caf50';
//       default: return '#9e9e9e';
//     }
//   };

//   // Event handlers
//   const handleViewTenant = (tenant) => {
//     setSelectedTenant(tenant);
//     setDialogOpen(true);
//   };

//   const handleStatusUpdate = async (tenantId, newStatus, reason = '') => {
//     try {
//       await tenantApi.updateStatus(tenantId, newStatus, reason);
//       await fetchTenants(false);
//       showSnackbar(`Tenant ${newStatus} successfully`, 'success');
//       setActionDialog({ open: false, type: '', tenant: null });
//       setActionReason('');
//     } catch (err) {
//       showSnackbar('Failed to update tenant status', 'error');
//     }
//   };

//   const handleBulkAction = async (action) => {
//     if (selectedTenants.length === 0) {
//       showSnackbar('Please select tenants first', 'warning');
//       return;
//     }

//     try {
//       await tenantApi.bulkUpdate(selectedTenants, action);
//       await fetchTenants(false);
//       setSelectedTenants([]);
//       showSnackbar(`${selectedTenants.length} tenants ${action} successfully`, 'success');
//       setBulkActionAnchor(null);
//     } catch (err) {
//       showSnackbar('Failed to perform bulk action', 'error');
//     }
//   };

//   const handleSelectTenant = (tenantId) => {
//     setSelectedTenants(prev =>
//       prev.includes(tenantId)
//         ? prev.filter(id => id !== tenantId)
//         : [...prev, tenantId]
//     );
//   };

//   const handleSelectAllTenants = (event) => {
//     if (event.target.checked) {
//       setSelectedTenants(filteredTenants.map(t => t.id));
//     } else {
//       setSelectedTenants([]);
//     }
//   };

//   const handleExportData = async (format) => {
//     try {
//       setLoading(true);
//       await tenantApi.exportData(format);
//       showSnackbar(`Data exported successfully as ${format.toUpperCase()}`, 'success');
//     } catch (err) {
//       showSnackbar('Failed to export data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openActionDialog = (type, tenant) => {
//     setActionDialog({ open: true, type, tenant });
//   };

//   const StatCard = ({ title, value, icon, gradient, badgeCount }) => (
//     <Card
//       sx={{
//         borderRadius: 3,
//         boxShadow: 3,
//         background: gradient,
//         color: 'white',
//         position: 'relative',
//         overflow: 'visible'
//       }}
//     >
//       <CardContent>
//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <Box>
//             <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
//               {value}
//             </Typography>
//             <Typography variant="body2" sx={{ opacity: 0.9 }}>
//               {title}
//             </Typography>
//           </Box>
//           <Box sx={{ position: 'relative' }}>
//             {badgeCount > 0 && (
//               <Badge
//                 badgeContent={badgeCount}
//                 color="error"
//                 sx={{ position: 'absolute', top: -8, right: -8 }}
//               >
//                 {icon}
//               </Badge>
//             )}
//             {badgeCount === 0 && icon}
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   );

//   const TabPanel = ({ children, value, index }) => (
//     <div hidden={value !== index}>
//       {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
//     </div>
//   );

//   return (
//     <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
//       {/* App Bar */}
//       <AppBar position="sticky" sx={{ backgroundColor: 'white', boxShadow: 1 }}>
//         <Toolbar>
//           <DashboardIcon sx={{ mr: 2, color: 'primary.main' }} />
//           <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary', fontWeight: 'bold' }}>
//             Super Admin Dashboard
//           </Typography>

//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={autoRefresh}
//                   onChange={(e) => setAutoRefresh(e.target.checked)}
//                   size="small"
//                 />
//               }
//               label={<Typography variant="body2" color="text.secondary">Auto Refresh</Typography>}
//             />

//             <Badge badgeContent={stats.pending} color="warning">
//               <IconButton>
//                 <NotificationsIcon />
//               </IconButton>
//             </Badge>

//             <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
//               <MoreVertIcon />
//             </IconButton>
//           </Box>
//         </Toolbar>

//         {refreshing && <LinearProgress />}
//       </AppBar>

//       <Container maxWidth="xl" sx={{ py: 3 }}>
//         {/* Breadcrumbs */}
//         <Breadcrumbs sx={{ mb: 2 }}>
//           <Link color="inherit" href="#" onClick={() => {}} sx={{ display: 'flex', alignItems: 'center' }}>
//             <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
//             Dashboard
//           </Link>
//           <Typography color="text.primary">Tenant Management</Typography>
//         </Breadcrumbs>

//         {/* Header */}
//         <Box sx={{ mb: 4 }}>
//           <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
//             Tenant Management Dashboard
//           </Typography>
//           <Typography variant="body1" color="text.secondary">
//             Monitor and manage tenant requests in real-time with advanced analytics and bulk operations.
//           </Typography>
//         </Box>

//         {/* Statistics Cards */}
//         <Grid container spacing={3} sx={{ mb: 4 }}>
//           <Grid item xs={12} sm={6} md={2}>
//             <StatCard
//               title="Total Requests"
//               value={stats.total}
//               icon={<BusinessIcon sx={{ fontSize: 40, opacity: 0.8 }} />}
//               gradient="linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)"
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={2}>
//             <StatCard
//               title="Pending"
//               value={stats.pending}
//               icon={<PendingIcon sx={{ fontSize: 40, opacity: 0.8 }} />}
//               gradient="linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)"
//               badgeCount={stats.highPriority}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={2}>
//             <StatCard
//               title="Approved"
//               value={stats.approved}
//               icon={<CheckCircleIcon sx={{ fontSize: 40, opacity: 0.8 }} />}
//               gradient="linear-gradient(135deg, #4caf50 0%, #81c784 100%)"
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={2}>
//             <StatCard
//               title="Rejected"
//               value={stats.rejected}
//               icon={<CancelIcon sx={{ fontSize: 40, opacity: 0.8 }} />}
//               gradient="linear-gradient(135deg, #f44336 0%, #e57373 100%)"
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={2}>
//             <StatCard
//               title="This Week"
//               value={stats.thisWeek}
//               icon={<TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />}
//               gradient="linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)"
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={2}>
//             <StatCard
//               title="High Priority"
//               value={stats.highPriority}
//               icon={<WarningIcon sx={{ fontSize: 40, opacity: 0.8 }} />}
//               gradient="linear-gradient(135deg, #e91e63 0%, #f06292 100%)"
//             />
//           </Grid>
//         </Grid>

//         {/* Filters and Controls */}
//         <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 2 }}>
//           <CardContent>
//             <Grid container spacing={2} alignItems="center">
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Search tenants..."
//                   variant="outlined"
//                   size="small"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   InputProps={{
//                     startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
//                   }}
//                 />
//               </Grid>

//               <Grid item xs={12} md={2}>
//                 <FormControl fullWidth size="small">
//                   <InputLabel>Status</InputLabel>
//                   <Select
//                     value={statusFilter}
//                     label="Status"
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                   >
//                     <MenuItem value="all">All Status</MenuItem>
//                     <MenuItem value="pending">Pending</MenuItem>
//                     <MenuItem value="approved">Approved</MenuItem>
//                     <MenuItem value="rejected">Rejected</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>

//               <Grid item xs={12} md={2}>
//                 <FormControl fullWidth size="small">
//                   <InputLabel>Sort By</InputLabel>
//                   <Select
//                     value={sortBy}
//                     label="Sort By"
//                     onChange={(e) => setSortBy(e.target.value)}
//                   >
//                     <MenuItem value="created_at">Date Created</MenuItem>
//                     <MenuItem value="tenant_name">Company Name</MenuItem>
//                     <MenuItem value="priority">Priority</MenuItem>
//                     <MenuItem value="estimated_users">Users</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>

//               <Grid item xs={12} md={2}>
//                 <Button
//                   fullWidth
//                   variant="outlined"
//                   startIcon={<RefreshIcon />}
//                   onClick={() => fetchTenants(false)}
//                   disabled={refreshing}
//                 >
//                   Refresh
//                 </Button>
//               </Grid>

//               <Grid item xs={12} md={2}>
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   startIcon={<DownloadIcon />}
//                   onClick={(e) => setBulkActionAnchor(e.currentTarget)}
//                   disabled={loading}
//                 >
//                   Export
//                 </Button>
//               </Grid>
//             </Grid>

//             {selectedTenants.length > 0 && (
//               <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 1 }}>
//                 <Typography variant="body2" sx={{ mb: 1 }}>
//                   {selectedTenants.length} tenant(s) selected
//                 </Typography>
//                 <Stack direction="row" spacing={1}>
//                   <Button
//                     size="small"
//                     variant="contained"
//                     color="success"
//                     onClick={() => handleBulkAction('approved')}
//                   >
//                     Bulk Approve
//                   </Button>
//                   <Button
//                     size="small"
//                     variant="contained"
//                     color="error"
//                     onClick={() => handleBulkAction('rejected')}
//                   >
//                     Bulk Reject
//                   </Button>
//                   <Button
//                     size="small"
//                     variant="outlined"
//                     onClick={() => setSelectedTenants([])}
//                   >
//                     Clear Selection
//                   </Button>
//                 </Stack>
//               </Box>
//             )}
//           </CardContent>
//         </Card>

//         {/* Main Content */}
//         <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
//           <Tabs
//             value={currentTab}
//             onChange={(e, newValue) => setCurrentTab(newValue)}
//             variant="fullWidth"
//             sx={{ borderBottom: 1, borderColor: 'divider' }}
//           >
//             <Tab
//               label={`All Requests (${filteredTenants.length})`}
//               icon={<AssignmentIcon />}
//               iconPosition="start"
//             />
//             <Tab
//               label={`Pending (${filteredTenants.filter(t => t.status === 'pending').length})`}
//               icon={<PendingIcon />}
//               iconPosition="start"
//             />
//             <Tab
//               label="Analytics"
//               icon={<AnalyticsIcon />}
//               iconPosition="start"
//             />
//             <Tab
//               label="Activity Log"
//               icon={<TimelineIcon />}
//               iconPosition="start"
//             />
//           </Tabs>

//           {/* Tab 1: All Requests */}
//           <TabPanel value={currentTab} index={0}>
//             {loading ? (
//               <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
//                 <CircularProgress />
//               </Box>
//             ) : error ? (
//               <Alert severity="error" sx={{ m: 2 }}>
//                 {error}
//                 <Button onClick={() => fetchTenants()} sx={{ ml: 2 }}>
//                   Retry
//                 </Button>
//               </Alert>
//             ) : filteredTenants.length === 0 ? (
//               <Box sx={{ textAlign: 'center', p: 4 }}>
//                 <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
//                 <Typography variant="h6" color="text.secondary" gutterBottom>
//                   No tenant requests found
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Try adjusting your search criteria or filters
//                 </Typography>
//               </Box>
//             ) : (
//               <>
//                 <TableContainer>
//                   <Table>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell padding="checkbox">
//                           <Checkbox
//                             indeterminate={selectedTenants.length > 0 && selectedTenants.length < filteredTenants.length}
//                             checked={selectedTenants.length === filteredTenants.length && filteredTenants.length > 0}
//                             onChange={handleSelectAllTenants}
//                           />
//                         </TableCell>
//                         <TableCell>Company</TableCell>
//                         <TableCell>Contact</TableCell>
//                         <TableCell>Plan & Users</TableCell>
//                         <TableCell>Status</TableCell>
//                         <TableCell>Priority</TableCell>
//                         <TableCell>Created</TableCell>
//                         <TableCell>Actions</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {filteredTenants
//                         .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                         .map((tenant) => (
//                         <TableRow
//                           key={tenant.id}
//                           hover
//                           selected={selectedTenants.includes(tenant.id)}
//                         >
//                           <TableCell padding="checkbox">
//                             <Checkbox
//                               checked={selectedTenants.includes(tenant.id)}
//                               onChange={() => handleSelectTenant(tenant.id)}
//                             />
//                           </TableCell>
//                           <TableCell>
//                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                               <Avatar
//                                 sx={{
//                                   mr: 2,
//                                   bgcolor: 'primary.main',
//                                   width: 40,
//                                   height: 40
//                                 }}
//                               >
//                                 {tenant.tenant_name.charAt(0)}
//                               </Avatar>
//                               <Box>
//                                 <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
//                                   {tenant.tenant_name}
//                                 </Typography>
//                                 <Typography variant="body2" color="text.secondary">
//                                   {tenant.industry} • {tenant.company_size}
//                                 </Typography>
//                                 <Typography variant="caption" color="text.secondary">
//                                   {tenant.contact_person}
//                                 </Typography>
//                               </Box>
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Stack spacing={0.5}>
//                               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                 <EmailIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
//                                 <Typography variant="body2">{tenant.email}</Typography>
//                               </Box>
//                               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                 <PhoneIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
//                                 <Typography variant="body2">{tenant.phone}</Typography>
//                               </Box>
//                             </Stack>
//                           </TableCell>
//                           <TableCell>
//                             <Chip
//                               label={tenant.subscription_plan}
//                               size="small"
//                               variant="outlined"
//                               color={
//                                 tenant.subscription_plan === 'Enterprise' ? 'primary' :
//                                 tenant.subscription_plan === 'Premium' ? 'secondary' : 'default'
//                               }
//                               sx={{ mb: 0.5 }}
//                             />
//                             <Typography variant="body2" color="text.secondary">
//                               {tenant.estimated_users} users
//                             </Typography>
//                             <Typography variant="caption" color="text.secondary">
//                               ${tenant.monthly_budget}/month
//                             </Typography>
//                           </TableCell>
//                           <TableCell>
//                             <Chip
//                               icon={getStatusIcon(tenant.status)}
//                               label={tenant.status.toUpperCase()}
//                               color={getStatusColor(tenant.status)}
//                               size="small"
//                               sx={{ fontWeight: 'bold' }}
//                             />
//                           </TableCell>
//                           <TableCell>
//                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                               <Box
//                                 sx={{
//                                   width: 8,
//                                   height: 8,
//                                   borderRadius: '50%',
//                                   bgcolor: getPriorityColor(tenant.priority),
//                                   mr: 1
//                                 }}
//                               />
//                               <Typography
//                                 variant="body2"
//                                 sx={{
//                                   textTransform: 'capitalize',
//                                   color: getPriorityColor(tenant.priority),
//                                   fontWeight: 'medium'
//                                 }}
//                               >
//                                 {tenant.priority}
//                               </Typography>
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Typography variant="body2">
//                               {formatDate(tenant.created_at)}
//                             </Typography>
//                           </TableCell>
//                           <TableCell>
//                             <Stack direction="row" spacing={0.5}>
//                               <Tooltip title="View Details">
//                                 <IconButton
//                                   size="small"
//                                   onClick={() => handleViewTenant(tenant)}
//                                 >
//                                   <VisibilityIcon fontSize="small" />
//                                 </IconButton>
//                               </Tooltip>

//                               {tenant.status === 'pending' && (
//                                 <>
//                                   <Tooltip title="Approve">
//                                     <IconButton
//                                       size="small"
//                                       color="success"
//                                       onClick={() => openActionDialog('approve', tenant)}
//                                     >
//                                       <CheckCircleIcon fontSize="small" />
//                                     </IconButton>
//                                   </Tooltip>

//                                   <Tooltip title="Reject">
//                                     <IconButton
//                                       size="small"
//                                       color="error"
//                                       onClick={() => openActionDialog('reject', tenant)}
//                                     >
//                                       <CancelIcon fontSize="small" />
//                                     </IconButton>
//                                   </Tooltip>
//                                 </>
//                               )}

//                               <Tooltip title="More Actions">
//                                 <IconButton
//                                   size="small"
//                                   onClick={(e) => {
//                                     setAnchorEl(e.currentTarget);
//                                     setSelectedTenant(tenant);
//                                   }}
//                                 >
//                                   <MoreVertIcon fontSize="small" />
//                                 </IconButton>
//                               </Tooltip>
//                             </Stack>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>

//                 <TablePagination
//                   component="div"
//                   count={filteredTenants.length}
//                   page={page}
//                   onPageChange={(e, newPage) => setPage(newPage)}
//                   rowsPerPage={rowsPerPage}
//                   onRowsPerPageChange={(e) => {
//                     setRowsPerPage(parseInt(e.target.value, 10));
//                     setPage(0);
//                   }}
//                   rowsPerPageOptions={[5, 10, 25, 50]}
//                 />
//               </>
//             )}
//           </TabPanel>

//           {/* Tab 2: Pending Requests */}
//           <TabPanel value={currentTab} index={1}>
//             <Stack spacing={2} sx={{ p: 2 }}>
//               {filteredTenants
//                 .filter(t => t.status === 'pending')
//                 .map((tenant) => (
//                   <Card
//                     key={tenant.id}
//                     sx={{
//                       borderLeft: 4,
//                       borderLeftColor: getPriorityColor(tenant.priority),
//                       '&:hover': { boxShadow: 4 }
//                     }}
//                   >
//                     <CardContent>
//                       <Grid container spacing={2}>
//                         <Grid item xs={12} md={8}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                             <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
//                               {tenant.tenant_name.charAt(0)}
//                             </Avatar>
//                             <Box>
//                               <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//                                 {tenant.tenant_name}
//                               </Typography>
//                               <Typography variant="body2" color="text.secondary">
//                                 {tenant.contact_person} • {tenant.industry}
//                               </Typography>
//                             </Box>
//                             <Chip
//                               label={tenant.priority}
//                               size="small"
//                               sx={{
//                                 ml: 'auto',
//                                 bgcolor: alpha(getPriorityColor(tenant.priority), 0.1),
//                                 color: getPriorityColor(tenant.priority)
//                               }}
//                             />
//                           </Box>

//                           <Grid container spacing={2} sx={{ mb: 2 }}>
//                             <Grid item xs={6}>
//                               <Typography variant="body2" color="text.secondary">Contact</Typography>
//                               <Typography variant="body2">{tenant.email}</Typography>
//                               <Typography variant="body2">{tenant.phone}</Typography>
//                             </Grid>
//                             <Grid item xs={6}>
//                               <Typography variant="body2" color="text.secondary">Details</Typography>
//                               <Typography variant="body2">
//                                 {tenant.subscription_plan} • {tenant.estimated_users} users
//                               </Typography>
//                               <Typography variant="body2">
//                                 Budget: ${tenant.monthly_budget}/month
//                               </Typography>
//                             </Grid>
//                           </Grid>

//                           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
//                             {tenant.requested_features?.map((feature, index) => (
//                               <Chip
//                                 key={index}
//                                 label={feature}
//                                 size="small"
//                                 variant="outlined"
//                               />
//                             ))}
//                           </Box>

//                           <Typography variant="body2" color="text.secondary">
//                             Requested: {formatDate(tenant.created_at)}
//                           </Typography>
//                         </Grid>

//                         <Grid item xs={12} md={4}>
//                           <CardActions sx={{ flexDirection: 'column', gap: 1, p: 0 }}>
//                             <Button
//                               fullWidth
//                               variant="contained"
//                               color="success"
//                               startIcon={<CheckCircleIcon />}
//                               onClick={() => openActionDialog('approve', tenant)}
//                             >
//                               Approve Request
//                             </Button>

//                             <Button
//                               fullWidth
//                               variant="outlined"
//                               color="error"
//                               startIcon={<CancelIcon />}
//                               onClick={() => openActionDialog('reject', tenant)}
//                             >
//                               Reject Request
//                             </Button>

//                             <Button
//                               fullWidth
//                               variant="text"
//                               startIcon={<VisibilityIcon />}
//                               onClick={() => handleViewTenant(tenant)}
//                             >
//                               View Full Details
//                             </Button>
//                           </CardActions>
//                         </Grid>
//                       </Grid>
//                     </CardContent>
//                   </Card>
//                 ))}

//               {filteredTenants.filter(t => t.status === 'pending').length === 0 && (
//                 <Box sx={{ textAlign: 'center', py: 6 }}>
//                   <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
//                   <Typography variant="h6" color="text.secondary" gutterBottom>
//                     No Pending Requests
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     All tenant requests have been processed
//                   </Typography>
//                 </Box>
//               )}
//             </Stack>
//           </TabPanel>

//           {/* Tab 3: Analytics */}
//           <TabPanel value={currentTab} index={2}>
//             <Grid container spacing={3} sx={{ p: 2 }}>
//               <Grid item xs={12} md={6}>
//                 <Card sx={{ p: 3, height: '100%' }}>
//                   <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//                     <PieChartIcon sx={{ mr: 1 }} />
//                     Status Distribution
//                   </Typography>
//                   <Box sx={{ mt: 3 }}>
//                     <Stack spacing={2}>
//                       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                         <Typography variant="body2">Pending</Typography>
//                         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                           {stats.pending} ({((stats.pending / stats.total) * 100).toFixed(1)}%)
//                         </Typography>
//                       </Box>
//                       <LinearProgress
//                         variant="determinate"
//                         value={(stats.pending / stats.total) * 100}
//                         color="warning"
//                         sx={{ height: 8, borderRadius: 4 }}
//                       />

//                       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                         <Typography variant="body2">Approved</Typography>
//                         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                           {stats.approved} ({((stats.approved / stats.total) * 100).toFixed(1)}%)
//                         </Typography>
//                       </Box>
//                       <LinearProgress
//                         variant="determinate"
//                         value={(stats.approved / stats.total) * 100}
//                         color="success"
//                         sx={{ height: 8, borderRadius: 4 }}
//                       />

//                       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                         <Typography variant="body2">Rejected</Typography>
//                         <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                           {stats.rejected} ({((stats.rejected / stats.total) * 100).toFixed(1)}%)
//                         </Typography>
//                       </Box>
//                       <LinearProgress
//                         variant="determinate"
//                         value={(stats.rejected / stats.total) * 100}
//                         color="error"
//                         sx={{ height: 8, borderRadius: 4 }}
//                       />
//                     </Stack>
//                   </Box>
//                 </Card>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <Card sx={{ p: 3, height: '100%' }}>
//                   <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//                     <BarChartIcon sx={{ mr: 1 }} />
//                     Industry Breakdown
//                   </Typography>
//                   <Box sx={{ mt: 3 }}>
//                     <Stack spacing={2}>
//                       {[...new Set(tenants.map(t => t.industry))].map(industry => {
//                         const count = tenants.filter(t => t.industry === industry).length;
//                         const percentage = (count / tenants.length) * 100;

//                         return (
//                           <Box key={industry}>
//                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                               <Typography variant="body2">{industry}</Typography>
//                               <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                                 {count} ({percentage.toFixed(1)}%)
//                               </Typography>
//                             </Box>
//                             <LinearProgress
//                               variant="determinate"
//                               value={percentage}
//                               sx={{ height: 6, borderRadius: 3, mt: 0.5 }}
//                             />
//                           </Box>
//                         );
//                       })}
//                     </Stack>
//                   </Box>
//                 </Card>
//               </Grid>

//               <Grid item xs={12}>
//                 <Card sx={{ p: 3 }}>
//                   <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//                     <TimelineIcon sx={{ mr: 1 }} />
//                     Key Metrics
//                   </Typography>
//                   <Grid container spacing={3} sx={{ mt: 2 }}>
//                     <Grid item xs={12} sm={6} md={3}>
//                       <Box sx={{ textAlign: 'center' }}>
//                         <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
//                           {Math.round(tenants.reduce((acc, t) => acc + t.estimated_users, 0) / tenants.length)}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           Avg Users per Tenant
//                         </Typography>
//                       </Box>
//                     </Grid>

//                     <Grid item xs={12} sm={6} md={3}>
//                       <Box sx={{ textAlign: 'center' }}>
//                         <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
//                           ${Math.round(tenants.reduce((acc, t) => acc + t.monthly_budget, 0) / 1000)}K
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           Total Monthly Revenue
//                         </Typography>
//                       </Box>
//                     </Grid>

//                     <Grid item xs={12} sm={6} md={3}>
//                       <Box sx={{ textAlign: 'center' }}>
//                         <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
//                           {Math.round((stats.approved / stats.total) * 100)}%
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           Approval Rate
//                         </Typography>
//                       </Box>
//                     </Grid>

//                     <Grid item xs={12} sm={6} md={3}>
//                       <Box sx={{ textAlign: 'center' }}>
//                         <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
//                           {Math.round(stats.thisWeek / 7 * 10) / 10}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           Avg Daily Requests
//                         </Typography>
//                       </Box>
//                     </Grid>
//                   </Grid>
//                 </Card>
//               </Grid>
//             </Grid>
//           </TabPanel>

//           {/* Tab 4: Activity Log */}
//           <TabPanel value={currentTab} index={3}>
//             <List sx={{ p: 2 }}>
//               {tenants
//                 .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
//                 .slice(0, 20)
//                 .map((tenant, index) => (
//                   <ListItem key={`${tenant.id}-${index}`} sx={{ mb: 1 }}>
//                     <ListItemAvatar>
//                       <Avatar
//                         sx={{
//                           bgcolor:
//                             tenant.status === 'approved' ? 'success.main' :
//                             tenant.status === 'pending' ? 'warning.main' :
//                             'error.main'
//                         }}
//                       >
//                         {getStatusIcon(tenant.status)}
//                       </Avatar>
//                     </ListItemAvatar>

//                     <ListItemText
//                       primary={
//                         <Typography>
//                           <strong>{tenant.tenant_name}</strong> - {tenant.status.toUpperCase()}
//                         </Typography>
//                       }
//                       secondary={
//                         <Box>
//                           <Typography variant="body2" color="text.secondary">
//                             {formatDate(tenant.updated_at)} • {tenant.subscription_plan} Plan
//                           </Typography>
//                           {tenant.status === 'rejected' && tenant.rejection_reason && (
//                             <Typography variant="body2" color="error.main" sx={{ mt: 0.5 }}>
//                               Reason: {tenant.rejection_reason}
//                             </Typography>
//                           )}
//                         </Box>
//                       }
//                     />

//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                       <Chip
//                         label={tenant.priority}
//                         size="small"
//                         sx={{
//                           bgcolor: alpha(getPriorityColor(tenant.priority), 0.1),
//                           color: getPriorityColor(tenant.priority)
//                         }}
//                       />
//                     </Box>
//                   </ListItem>
//                 ))}
//             </List>
//           </TabPanel>
//         </Card>
//       </Container>

//       {/* Floating Action Button */}
//       <SpeedDial
//         ariaLabel="Quick Actions"
//         sx={{ position: 'fixed', bottom: 16, right: 16 }}
//         icon={<SpeedDialIcon />}
//       >
//         <SpeedDialAction
//           icon={<RefreshIcon />}
//           tooltipTitle="Refresh Data"
//           onClick={() => fetchTenants(false)}
//         />
//         <SpeedDialAction
//           icon={<DownloadIcon />}
//           tooltipTitle="Export Data"
//           onClick={(e) => setBulkActionAnchor(e.currentTarget)}
//         />
//         <SpeedDialAction
//           icon={<AnalyticsIcon />}
//           tooltipTitle="View Analytics"
//           onClick={() => setCurrentTab(2)}
//         />
//       </SpeedDial>

//       {/* Tenant Details Dialog */}
//       <Dialog
//         open={dialogOpen}
//         onClose={() => setDialogOpen(false)}
//         maxWidth="lg"
//         fullWidth
//         PaperProps={{ sx: { borderRadius: 3 } }}
//       >
//         <DialogTitle sx={{ pb: 1 }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//               {selectedTenant?.tenant_name} - Detailed Information
//             </Typography>
//             <IconButton onClick={() => setDialogOpen(false)}>
//               <CloseIcon />
//             </IconButton>
//           </Box>
//         </DialogTitle>

//         <DialogContent>
//           {selectedTenant && (
//             <Grid container spacing={3}>
//               <Grid item xs={12} md={6}>
//                 <Stack spacing={3}>
//                   <Card variant="outlined">
//                     <CardContent>
//                       <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
//                         <BusinessIcon sx={{ mr: 1 }} />
//                         Company Information
//                       </Typography>
//                       <Stack spacing={1}>
//                         <Box>
//                           <Typography variant="body2" color="text.secondary">Company Name</Typography>
//                           <Typography variant="body1">{selectedTenant.tenant_name}</Typography>
//                         </Box>
//                         <Box>
//                           <Typography variant="body2" color="text.secondary">Industry</Typography>
//                           <Typography variant="body1">{selectedTenant.industry}</Typography>
//                         </Box>
//                         <Box>
//                           <Typography variant="body2" color="text.secondary">Company Size</Typography>
//                           <Typography variant="body1">{selectedTenant.company_size}</Typography>
//                         </Box>
//                         <Box>
//                           <Typography variant="body2" color="text.secondary">Website</Typography>
//                           <Link href={selectedTenant.website} target="_blank" rel="noopener">
//                             {selectedTenant.website}
//                           </Link>
//                         </Box>
//                         <Box>
//                           <Typography variant="body2" color="text.secondary">Tax ID</Typography>
//                           <Typography variant="body1">{selectedTenant.tax_id}</Typography>
//                         </Box>
//                       </Stack>
//                     </CardContent>
//                   </Card>

//                   <Card variant="outlined">
//                     <CardContent>
//                       <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
//                         <PeopleIcon sx={{ mr: 1 }} />
//                         Contact Information
//                       </Typography>
//                       <Stack spacing={1}>
//                         <Box>
//                           <Typography variant="body2" color="text.secondary">Contact Person</Typography>
//                           <Typography variant="body1">{selectedTenant.contact_person}</Typography>
//                         </Box>
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <EmailIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
//                           <Typography variant="body1">{selectedTenant.email}</Typography>
//                         </Box>
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <PhoneIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
//                           <Typography variant="body1">{selectedTenant.phone}</Typography>
//                         </Box>
//                         <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
//                           <LocationOnIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary', mt: 0.5 }} />
//                           <Typography variant="body1">{selectedTenant.address}</Typography>
//                         </Box>
//                       </Stack>
//                     </CardContent>
//                   </Card>
//                 </Stack>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <Stack spacing={3}>
//                   <Card variant="outlined">
//                     <CardContent>
//                       <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
//                         <AttachMoneyIcon sx={{ mr: 1 }} />
//                         Subscription Details
//                       </Typography>
//                       <Stack spacing={1}>
//                         <Box>
//                           <Typography variant="body2" color="text.secondary">Plan</Typography>
//                           <Chip
//                             label={selectedTenant.subscription_plan}
//                             color={
//                               selectedTenant.subscription_plan === 'Enterprise' ? 'primary' :
//                               selectedTenant.subscription_plan === 'Premium' ? 'secondary' : 'default'
//                             }
//                             sx={{ mt: 2 }}
//             />
//             </Box>
//             </Stack>
//             </CardContent>
//             </Card>
//           </Stack>

//             <DialogContent>
//               {actionDialog.type === 'reject' && (
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={4}
//                   variant="outlined"
//                   label="Reason for Rejection"
//                   value={actionReason}
//                   onChange={(e) => setActionReason(e.target.value)}
//                 />
//               )}
//             </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setActionDialog({ open: false, type: '', tenant: null })}>
//               Cancel
//             </Button>
//             <Button
//               variant="contained"
//               color={actionDialog.type === 'approve' ? 'success' : 'error'}
//               onClick={() => handleStatusUpdate(actionDialog.tenant?.id, actionDialog.type === 'approve' ? 'approved' : 'rejected', actionReason)}
//             >
//               {actionDialog.type === 'approve' ? 'Approve' : 'Reject'}
//             </Button>
//           </DialogActions>
//             <Button onClick={() => setActionDialog({ open: false, type: '', tenant: null })}>
//               Cancel
//             </Button>
//             <Button
//             variant="contained"
//             color={actionDialog.type === 'approve' ? 'success' : 'error'}
//             onClick={() => handleStatusUpdate(actionDialog.tenant?.id, actionDialog.type === 'approve' ? 'approved' : 'rejected', actionReason)}
//           >
//             {actionDialog.type === 'approve' ? 'Approve' : 'Reject'}
//           </Button>

//       {/* Context Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={() => setAnchorEl(null)}
//       >
//         <MenuItem onClick={() => handleViewTenant(selectedTenant)}>
//           <ListItemIcon>
//             <VisibilityIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>View Details</ListItemText>
//         </MenuItem>

//         {selectedTenant?.status === 'pending' && (
//           <>
//             <MenuItem onClick={() => {
//               setAnchorEl(null);
//               openActionDialog('approve', selectedTenant);
//             }}>
//               <ListItemIcon>
//                 <CheckCircleIcon fontSize="small" />
//               </ListItemIcon>
//               <ListItemText>Approve</ListItemText>
//             </MenuItem>

//             <MenuItem onClick={() => {
//               setAnchorEl(null);
//               openActionDialog('reject', selectedTenant);
//             }}>
//               <ListItemIcon>
//                 <CancelIcon fontSize="small" />
//               </ListItemIcon>
//               <ListItemText>Reject</ListItemText>
//             </MenuItem>
//           </>
//         )}

//         <Divider />

//         <MenuItem onClick={() => {
//           setAnchorEl(null);
//           // Add edit functionality here
//         }}>
//           <ListItemIcon>
//             <EditIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>Edit Details</ListItemText>
//         </MenuItem>

//         <MenuItem onClick={() => {
//           setAnchorEl(null);
//           // Add delete functionality here
//         }}>
//           <ListItemIcon>
//             <DeleteIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>Delete Request</ListItemText>
//         </MenuItem>
//       </Menu>

//       {/* Bulk Actions Menu */}
//       <Menu
//         anchorEl={bulkActionAnchor}
//         open={Boolean(bulkActionAnchor)}
//         onClose={() => setBulkActionAnchor(null)}
//       >
//         <MenuItem onClick={() => {
//           setBulkActionAnchor(null);
//           handleExportData('csv');
//         }}>
//           <ListItemIcon>
//             <DownloadIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>Export as CSV</ListItemText>
//         </MenuItem>

//         <MenuItem onClick={() => {
//           setBulkActionAnchor(null);
//           handleExportData('xlsx');
//         }}>
//           <ListItemIcon>
//             <DownloadIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>Export as Excel</ListItemText>
//         </MenuItem>

//         <MenuItem onClick={() => {
//           setBulkActionAnchor(null);
//           handleExportData('pdf');
//         }}>
//           <ListItemIcon>
//             <DownloadIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>Export as PDF</ListItemText>
//         </MenuItem>
//       </Menu>

//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>

//                         <Box>
//                           <Typography variant="body2" color="text.secondary">Estimated Users</Typography>
//                           <Typography variant="body1">{selectedTenant.estimated_users}</Typography>
//                         </Box>
//                         <Box>
//                           <Typography variant="body2" color="text.secondary">Monthly Budget</Typography>
//                           <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
//                             ${selectedTenant.monthly_budget}
//                           </Typography>
//                         </Box>
//                         <Box>
//                           <Typography variant="body2" color="text.secondary">Status</Typography>
//                           <Chip
//                             icon={getStatusIcon(selectedTenant.status)}
//                             label={selectedTenant.status.toUpperCase()}
//                             color={getStatusColor(selectedTenant.status)}
//                             sx={{ mt: 0.5 }}
//                           />
//                         </Box>
//                         <Box>
//                           <Typography variant="body2" color="text.secondary">Priority</Typography>
//                           <Chip
//                             label={selectedTenant.priority}
//                             size="small"
//                             sx={{
//                               mt: 0.5,
//                               bgcolor: alpha(getPriorityColor(selectedTenant.priority), 0.1),
//                               color: getPriorityColor(selectedTenant.priority)
//                             }}
//                           />
//                         </Box>

//                   <Card variant="outlined">
//                     <CardContent>
//                       <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
//                         <SettingsIcon sx={{ mr: 1 }} />
//                         Requested Features
//                       </Typography>
//                       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
//                         {selectedTenant.requested_features?.map((feature, index) => (
//                           <Chip
//                             key={index}
//                             label={feature}
//                             variant="outlined"
//                             size="small"
//                           />
//                         ))}
//                       </Box>
//                     </CardContent>
//                   </Card>

//                   <Card variant="outlined">
//                     <CardContent>
//                       <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
//                         <CalendarTodayIcon sx={{ mr: 1 }} />
//                         Timeline
//                       </Typography>
//                       <Stack spacing={1}>
//                         <Box>
//                           <Typography variant="body2" color="text.secondary">Request Date</Typography>
//                           <Typography variant="body1">{formatDate(selectedTenant.created_at)}</Typography>
//                         </Box>
//                         <Box>
//                           <Typography variant="body2" color="text.secondary">Last Updated</Typography>
//                           <Typography variant="body1">{formatDate(selectedTenant.updated_at)}</Typography>
//                         </Box>
//                         {selectedTenant.status === 'rejected' && selectedTenant.rejection_reason && (
//                           <Box>
//                             <Typography variant="body2" color="text.secondary">Rejection Reason</Typography>
//                             <Typography variant="body1" color="error.main">
//                               {selectedTenant.rejection_reason}
//                             </Typography>
//                           </Box>
//                         )}
//                       </Stack>
//                     </CardContent>
//                   </Card>

//               </Grid>
//             </Grid>
//           )}
//         </DialogContent>

//         <DialogActions sx={{ p: 3, pt: 1 }}>
//           <Button onClick={() => setDialogOpen(false)}>
//             Close
//           </Button>
//           {selectedTenant?.status === 'pending' && (
//             <>
//               <Button
//                 variant="contained"
//                 color="success"
//                 startIcon={<CheckCircleIcon />}
//                 onClick={() => {
//                   setDialogOpen(false);
//                   openActionDialog('approve', selectedTenant);
//                 }}
//               >
//                 Approve
//               </Button>
//               <Button
//                 variant="contained"
//                 color="error"
//                 startIcon={<CancelIcon />}
//                 onClick={() => {
//                   setDialogOpen(false);
//                   openActionDialog('reject', selectedTenant);
//                 }}
//               >
//                 Reject
//               </Button>
//             </>
//           )}
//         </DialogActions>
//       </Dialog>

//       {/* Action Confirmation Dialog */}
//       <Dialog
//         open={actionDialog.open}
//         onClose={() => setActionDialog({ open: false, type: '', tenant: null })}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>
//           {actionDialog.type === 'approve' ? 'Approve Tenant Request' : 'Reject Tenant Request'}
//         </DialogTitle>
//         <DialogContent>
//           <Typography variant="body1" gutterBottom>
//             Are you sure you want to {actionDialog.type} the request from{' '}
//             <strong>{actionDialog.tenant?.tenant_name}</strong>?
//           </Typography>

//           {actionDialog.type === 'reject' && (
//             <TextField
//               fullWidth
//               multiline
//               rows={3}
//               label="Reason for rejection (optional)"
//               value={actionReason}
//               onChange={(e) => setActionReason(e.target.value)}
//               sx={{ mt: 2 }}
//               inputProps={{ maxLength: 500 }}
//             />
//           )}
//         </DialogContent>
//       </Dialog>

//   </Box>
// )
// };

// export default SuperAdminDashboard;
