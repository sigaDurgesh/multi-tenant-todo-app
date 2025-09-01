// src/pages/LandingPage.jsx
import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Zoom,
  Fade,
  Paper,
  alpha,
  styled,
  IconButton,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import {
  Apartment,
  Security,
  Speed,
  Cloud,
  Analytics,
  AutoAwesome,
  Star,
  Groups,
  TaskAlt,
  Public,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

// ✅ Styled Gradient Button
const GradientButton = styled(Button)(() => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: "50px",
  padding: "10px 28px",
  fontSize: "1rem",
  fontWeight: "600",
  textTransform: "none",
  color: "#fff",
  boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)",
  "&:hover": {
    background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
    transform: "translateY(-3px)",
  },
}));

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // ✅ State for animations
  const [statsVisible, setStatsVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStatsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Stats Section
  const stats = [
    {
      icon: <Groups sx={{ color: "#667eea" }} />,
      number: "100K+",
      label: "Organizations",
    },
    {
      icon: <TaskAlt sx={{ color: "#43e97b" }} />,
      number: "5M+",
      label: "Tasks Managed",
    },
    {
      icon: <Public sx={{ color: "#f093fb" }} />,
      number: "50+",
      label: "Countries",
    },
    {
      icon: <Star sx={{ color: "#fa709a" }} />,
      number: "4.9/5",
      label: "Customer Rating",
    },
  ];

  // ✅ Features
  const features = [
    {
      icon: <Apartment sx={{ fontSize: 48, color: "#667eea" }} />,
      title: "Multi-Tenant Architecture",
      description:
        "Enterprise-grade multi-tenancy with complete data isolation, custom branding, and scalable infrastructure.",
    },
    {
      icon: <Security sx={{ fontSize: 48, color: "#f093fb" }} />,
      title: "Military-Grade Security",
      description:
        "Advanced encryption, SSO, JWT authentication, and compliance with SOC2, GDPR, HIPAA.",
    },

    {
      icon: <Analytics sx={{ fontSize: 48, color: "#fa709a" }} />,
      title: "Advanced Analytics",
      description:
        "Real-time dashboards, productivity insights, team metrics, and AI-powered recommendations.",
    },
    {
      icon: <AutoAwesome sx={{ fontSize: 48, color: "#a8edea" }} />,
      title: "AI Automation",
      description:
        "Smart task prioritization, automated workflows, intelligent notifications, predictive analytics.",
    },
  ];

  // ✅ Pricing
  const pricingPlans = [
    {
      title: "Starter",
      price: "Free",
      description: "Best for individuals and small teams  started.",
      features: ["Up to 3 Tenants", "Basic Analytics","Priority Support",, "Community Support"],
    },
    {
      title: "Pro",
      price: "$29/mo",
      description: "For growing organizations needing scalability.",
      features: [
        "Unlimited Tenants",
        "Advanced Analytics",
        "Priority Support",
        "Custom Branding",
      ],
    },
    {
      title: "Enterprise",
      price: "Custom",
      description: "Tailored for large-scale organizations.",
      features: [
        "Dedicated Infrastructure",
        "Enterprise SSO",
        "Custom Integrations",
        "24/7 Support",
      ],
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff", color: "#111" }}>
      {/* ✅ Navbar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "#fff",
          color: "#111",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: "#667eea", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            MultiTenant
          </Typography>

          {/* Desktop Menu */}
          <Stack
            direction="row"
            spacing={4}
            alignItems="center"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Button
              color="inherit"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Features
            </Button>
            <Button
              color="inherit"
              onClick={() =>
                document
                  .getElementById("pricing")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Pricing
            </Button>
            <Button
              color="inherit"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Contact
            </Button>
            {!user ? (
              <GradientButton onClick={() => navigate("/login")}>
                Get Started
              </GradientButton>
            ) : (
              <GradientButton
                onClick={() =>
                  navigate(user.role === "user" ? "/user/todos" : "/dashboard")
                }
              >
                Dashboard
              </GradientButton>
            )}
          </Stack>

          {/* Mobile Menu (Hamburger) */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <IconButton onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          <Box sx={{ width: 260, p: 3 }}>
            <Stack spacing={2}>
              <Button
                color="inherit"
                onClick={() => {
                  setMobileOpen(false);
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Features
              </Button>
              <Button
                color="inherit"
                onClick={() => {
                  setMobileOpen(false);
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Pricing
              </Button>
              <Button
                color="inherit"
                onClick={() => {
                  setMobileOpen(false);
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Contact
              </Button>
              {!user ? (
                <GradientButton
                  fullWidth
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/login");
                  }}
                >
                  Get Started
                </GradientButton>
              ) : (
                <GradientButton
                  fullWidth
                  onClick={() => {
                    setMobileOpen(false);
                    navigate(
                      user.role === "user" ? "/user/todos" : "/dashboard"
                    );
                  }}
                >
                  Dashboard
                </GradientButton>
              )}
            </Stack>
          </Box>
        </Drawer>
      </AppBar>

      {/* ✅ Hero Section */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
          pt: { xs: 10, md: 15 },
          pb: { xs: 10, md: 20 },
        }}
      >
        <Container maxWidth="lg">
          {/* Top Tag */}
          <Chip
            icon={<Star sx={{ color: "#fbc02d" }} />}
            label="Trusted by 100K+ organizations worldwide"
            sx={{
              mb: 3,
              px: 2,
              py: 0.5,
              fontSize: "0.9rem",
              fontWeight: 500,
              background: alpha("#1976d2", 0.08),
              color: "#1976d2",
              borderRadius: "8px",
            }}
          />

          {/* Main Heading */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.8rem", md: "4rem" },
              lineHeight: 1.2,
              mb: 3,
            }}
          >
            Supercharge Your{" "}
            <Box component="span" sx={{ color: "#667eea" }}>
              Team Productivity
            </Box>{" "}
            with{" "}
            <Box component="span" sx={{ color: "#764ba2" }}>
              MultiTenant
            </Box>
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: "720px",
              mx: "auto",
              mb: 6,
              fontWeight: 400,
              fontSize: { xs: "1rem", md: "1.2rem" },
            }}
          >
            MultiTenant is a modern multi-tenant platform that helps
            organizations manage{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "#1976d2" }}>
              tasks, users, and workflows
            </Box>{" "}
            with simplicity and scale. Secure, lightning-fast, and AI-powered.
          </Typography>

          {/* CTA Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 10 }}
          >
            {!user ? (
              <>
                <GradientButton onClick={() => navigate("/becometenant")}>
                  Get Started Free
                </GradientButton>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ px: 4, borderRadius: "10px" }}
                  onClick={() => navigate("/register-under-tenant")}
                >
                  Register Under Tenant
                </Button>
                <Button
                  size="large"
                  sx={{ px: 4, borderRadius: "10px" }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </>
            ) : user.role === "user" ? (
              <GradientButton onClick={() => navigate("/user/todos")}>
                Go to Workspace
              </GradientButton>
            ) : (
              <GradientButton onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </GradientButton>
            )}
          </Stack>

          {/* Stats Section */}
          <Grid container spacing={3} justifyContent="center">
            {stats.map((stat, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Fade in={statsVisible} timeout={1000 + i * 400}>
                  <Paper
                    elevation={0}
                    sx={{
                      py: 5,
                      px: 3,
                      textAlign: "center",
                      borderRadius: 4,
                      border: "1px solid",
                      borderColor: "divider",
                      background: "#fff",
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight={800}
                      gutterBottom
                      sx={{ color: "#1976d2" }}
                    >
                      {stat.icon} {stat.number}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Paper>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 8, md: 12 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.2rem", md: "3rem" },
              fontWeight: 800,
              mb: 3,
              color: "#1976d2",
            }}
          >
            Powerful Features
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
              fontWeight: 400,
              lineHeight: 1.7,
              fontSize: { xs: "1rem", md: "1.15rem" },
            }}
          >
            Everything you need to build, scale, and manage your organization's
            productivity — all in one clean and simple platform.
          </Typography>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={{ xs: 4, md: 6 }} justifyContent="center">
          {features.map((feature, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Zoom in timeout={700 + index * 200}>
                <Card
                  sx={{
                    flex: 1,
                    maxWidth: 360,
                    borderRadius: 3,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": { transform: "translateY(-5px)" },
                  }}
                >
                  <CardContent
                    sx={{
                      p: { xs: 4, md: 5 },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        background: alpha("#1976d2", 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                        color: "#1976d2",
                        fontSize: 28,
                      }}
                    >
                      {feature.icon}
                    </Box>

                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        color: "#111",
                        fontSize: { xs: "1.2rem", md: "1.4rem" },
                      }}
                    >
                      {feature.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.6,
                        flexGrow: 1,
                        fontSize: "0.95rem",
                      }}
                    >
                      {feature.description}
                    </Typography>

                    <Button
                      variant="text"
                      sx={{
                        mt: 3,
                        p: 0,
                        color: "#1976d2",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        textTransform: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      Learn More →
                    </Button>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ✅ Pricing Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }} id="pricing">
        <Box sx={{ textAlign: "center", mb: { xs: 8, md: 12 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.2rem", md: "3rem" },
              fontWeight: 800,
              mb: 3,
              color: "#667eea",
            }}
          >
            Simple Pricing
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "text.secondary", maxWidth: 700, mx: "auto" }}
          >
            Choose the plan that works best for your organization.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {pricingPlans.map((plan, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow:
                    plan.title === "Pro"
                      ? "0 8px 32px rgba(102, 126, 234, 0.4)"
                      : "0 4px 16px rgba(0,0,0,0.08)",
                  border:
                    plan.title === "Pro"
                      ? "2px solid #fefff2ff"
                      : "1px solid rgba(0,0,0,0.08)",
                  transform: plan.title === "Pro" ? "scale(1.05)" : "none",
                }}
              >
                <CardContent sx={{ p: 5, textAlign: "center" }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {plan.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                    {plan.price}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 3 }}
                  >
                    {plan.description}
                  </Typography>
                  <Stack spacing={1.5} sx={{ mb: 4 }}>
                    {plan.features.map((f, j) => (
                      <Typography key={j} variant="body2">
                        ✅ {f}
                      </Typography>
                    ))}
                  </Stack>
                  <GradientButton>Get Started</GradientButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ✅ Footer */}
      <Box
        component="footer"
        sx={{
          py: { xs: 6, md: 10 },
          borderTop: "1px solid rgba(0,0,0,0.1)",
          mt: 8,
          background: "#f8f9fa",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {/* Logo + Tagline */}
            <Grid item xs={12} md={3}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 800, mb: 2, color: "#667eea" }}
              >
                MultiTenant
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 3 }}
              >
                The future of team productivity and collaboration. Built with ❤️
                for the modern workforce.
              </Typography>
              {/* Social Icons */}
              <Stack direction="row" spacing={2}>
                <Button
                  href="https://twitter.com"
                  target="_blank"
                  sx={{ minWidth: 0, p: 1, color: "text.secondary" }}
                >
                  <i className="fab fa-twitter"></i>
                </Button>
                <Button
                  href="https://linkedin.com"
                  target="_blank"
                  sx={{ minWidth: 0, p: 1, color: "text.secondary" }}
                >
                  <i className="fab fa-linkedin"></i>
                </Button>
                <Button
                  href="https://github.com"
                  target="_blank"
                  sx={{ minWidth: 0, p: 1, color: "text.secondary" }}
                >
                  <i className="fab fa-github"></i>
                </Button>
              </Stack>
            </Grid>

            {/* Product */}
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Product
              </Typography>
              <Stack spacing={1}>
                <Button color="inherit" sx={{ justifyContent: "flex-start" }}>
                  Features
                </Button>
                <Button color="inherit" sx={{ justifyContent: "flex-start" }}>
                  Pricing
                </Button>
                <Button color="inherit" sx={{ justifyContent: "flex-start" }}>
                  Docs
                </Button>
              </Stack>
            </Grid>

            {/* Company */}
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Company
              </Typography>
              <Stack spacing={1}>
                <Button color="inherit" sx={{ justifyContent: "flex-start" }}>
                  About
                </Button>
                <Button color="inherit" sx={{ justifyContent: "flex-start" }}>
                  Careers
                </Button>
                <Button color="inherit" sx={{ justifyContent: "flex-start" }}>
                  Contact
                </Button>
              </Stack>
            </Grid>

            {/* Resources */}
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Resources
              </Typography>
              <Stack spacing={1}>
                <Button color="inherit" sx={{ justifyContent: "flex-start" }}>
                  Blog
                </Button>
                <Button color="inherit" sx={{ justifyContent: "flex-start" }}>
                  Help Center
                </Button>
                <Button color="inherit" sx={{ justifyContent: "flex-start" }}>
                  API Docs
                </Button>
              </Stack>
            </Grid>

            {/* Legal */}
            <Grid item xs={6} md={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Legal
              </Typography>
              <Stack spacing={1}>
                <Button color="inherit" sx={{ justifyContent: "flex-start" }}>
                  Terms of Service
                </Button>
                <Button color="inherit" sx={{ justifyContent: "flex-start" }}>
                  Privacy Policy
                </Button>
                <Button color="inherit" sx={{ justifyContent: "flex-start" }}>
                  Security
                </Button>
              </Stack>
            </Grid>
          </Grid>

          {/* Bottom Row */}
          <Box
            sx={{
              textAlign: "center",
              mt: 6,
              color: "text.secondary",
              fontSize: "0.9rem",
            }}
          >
            &copy; {new Date().getFullYear()} MultiTenant. All rights reserved.
            | Designed with ❤️ using React & MUI
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
