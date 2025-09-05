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
  Link,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

import {
  Apartment,
  Security,
  AutoAwesome,
  Star,
  Groups,
  TaskAlt,
  Public,
  ListAlt,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

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
  const { user ,openLogoutDialog } = useContext(AuthContext);

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

  const menuItems = [
    { label: "Features", id: "features" },
    { label: "Pricing", id: "pricing" },
    { label: "Contact", id: "contact" },
  ];
  // ✅ Features
  const features = [
    {
      icon: <Apartment sx={{ fontSize: 48, color: "#667eea" }} />,
      title: "Multi-Tenant Support",
      description:
        "Manage multiple tenants with isolated data, user roles, and configurable settings per tenant.",
    },
    {
      icon: <Security sx={{ fontSize: 48, color: "#f093fb" }} />,
      title: "Secure Access Control",
      description:
        "Role-based permissions, JWT authentication, and secure data handling for all users.",
    },
    {
      icon: <ListAlt sx={{ fontSize: 48, color: "#fa709a" }} />,
      title: "Task Management",
      description:
        "Create, edit, delete, and complete todos with real-time updates and notifications.",
    },
    {
      icon: <AutoAwesome sx={{ fontSize: 48, color: "#a8edea" }} />,
      title: "Smart Productivity",
      description:
        "Prioritize tasks, track progress, and improve productivity with AI-powered suggestions.",
    },
  ];

  // Example data for 3 rows
  const sections = [
    {
      title: "Collaboration",
      description:
        "Communicate in countless ways from one place. Tenant is built for bringing people and information together. Type things out. Talk things through. Invite external organisations into the conversation. A GIF shows how people collaborate using channels in Slack. 80% of the Fortune 100 use TenantConnect to work with partners and customers.",
      imageUrl:
        "https://a.slack-edge.com/b5bbfef/marketing/img/homepage/revamped-24/mobile/value-props/image-collaboration.en-GB@2x.png",
    },
    {
      title: "Integration",
      description:
        "Connect the tools you already use into one central hub. Automate workflows and streamline your processes with seamless integrations. Keep everything organized and accessible from a single platform.",
      imageUrl:
        "https://a.slack-edge.com/b5bbfef/marketing/img/homepage/revamped-24/mobile/value-props/image-project-management.en-GB@2x.jpg",
    },
    {
      title: "Productivity",
      description:
        "Focus on what matters. Reduce distractions and manage tasks efficiently. Bring teams together to achieve more with shared spaces and real-time collaboration tools.",
      imageUrl:
        "https://a.slack-edge.com/b5bbfef/marketing/img/homepage/revamped-24/mobile/value-props/image-integrations.en-GB@2x.jpg",
    },
  ];
  // ✅ Pricing
  const pricingPlans = [
    {
      title: "Starter",
      price: "Free",
      description: "Best for individuals and small teams  started.",
      features: [
        "Up to 3 Tenants",
        "Basic Analytics",
        "Priority Support",
        ,
        "Community Support",
      ],
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
          color: "#181212ff",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Typography
            variant="h5"
            sx={{ fontWeight: 900, color: "#667eea", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            MultiTenant
          </Typography>

          {/* Desktop Menu */}
          <Stack
            direction="row"
            spacing={4}
            alignItems="center"
            sx={{
              flexGrow: 1,
              justifyContent: "center",
              display: { xs: "none", md: "flex" },
            }}
          >
            {menuItems.map((item) => (
              <Button
                key={item.id}
                color="inherit"
                onClick={() => scrollToSection(item.id)}
                sx={{ fontWeight: 500 }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          {/* Right Action Button */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            {!user ? (
              <GradientButton onClick={() => navigate("/login")}>
                Become A Tenant
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
          </Box>

          {/* Mobile Hamburger */}
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
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  color="inherit"
                  onClick={() => {
                    setMobileOpen(false);
                    scrollToSection(item.id);
                  }}
                >
                  {item.label}
                </Button>
              ))}
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
                  Become A Tenant
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
              
              <>

              <GradientButton onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </GradientButton>
              <GradientButton onClick={openLogoutDialog}>
                Logout
              </GradientButton>
              
              </>
              
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

      {/*  Text and Image */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 12 } }}>
        {sections.map((section, index) => (
          <Grid
            container
            key={index}
            spacing={6}
            alignItems="center"
            sx={{ mb: 10 }}
          >
            <Grid
              container
              spacing={4} // space between text and image
              alignItems="center"
              sx={{ py: { xs: 4, md: 8 } }} // vertical padding
            >
              {/* Text Column */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: { xs: "center", md: "left" },
                  px: { xs: 2, md: 0 }, // horizontal padding on mobile
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: "1.8rem", md: "2.2rem" },
                    color: "#111",
                    lineHeight: 1.3,
                  }}
                >
                  {section.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    color: "text.secondary",
                    lineHeight: 1.8,
                    fontSize: { xs: "1rem", md: "1.05rem" },
                    maxWidth: { md: "600px" }, // restrict width
                  }}
                >
                  {section.description}
                </Typography>

                <Link
                  to="/your-path"
                  underline="hover" // only underline on hover
                  sx={{
                    mt: 2,
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color: "#1976d2", // typical link color
                    alignSelf: { xs: "center", md: "flex-start" }, // responsive alignment
                    cursor: "pointer",
                  }}
                >
                  Learn More
                </Link>
              </Grid>

              {/* Image Column */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                  alignItems: "center",
                }}
              >
                <Box
                  component="img"
                  src={section.imageUrl}
                  alt={section.title}
                  sx={{
                    width: "100%",
                    maxWidth: 500,
                    borderRadius: 3,
                    // boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Container>

      {/*text */}
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 6, md: 12 },
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1200 }}>
          {/* Section Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: { xs: 4, md: 8 },
              textAlign: "center",
              color: "#111",
              fontSize: { xs: "1.8rem", md: "2.2rem" },
            }}
          >
            We’re in the business of growing businesses.
          </Typography>

          <Grid
            container
            spacing={0}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "center",
              alignItems: "stretch",
            }}
          >
            {/* Left Statistic */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                backgroundColor: "#1976d2",
                color: "#fff",
                borderTopLeftRadius: { xs: "20px", md: "40px" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                px: 4,
                py: 4,
                minHeight: { md: "300px" },
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2.5rem", md: "3rem" },
                  mb: 2,
                }}
              >
                90%
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.6,
                  maxWidth: { md: "220px" },
                }}
              >
                of users say that Tenant helps them stay more connected
              </Typography>
            </Grid>

            {/* Middle Statistic */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                backgroundColor: "#42a5f5",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                px: 4,
                py: 4,
                minHeight: { md: "300px" },
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2.5rem", md: "3rem" },
                  mb: 2,
                }}
              >
                89%
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.6,
                  maxWidth: { md: "220px" },
                }}
              >
                of users say that Tenant improves communication
              </Typography>
            </Grid>

            {/* Right Statistic */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                backgroundColor: "#64b5f6",
                color: "#fff",
                borderTopRightRadius: { xs: "20px", md: "40px" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                px: 4,
                py: 4,
                minHeight: { md: "300px" },
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2.5rem", md: "3rem" },
                  mb: 2,
                }}
              >
                36%
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.6,
                  maxWidth: { md: "220px" },
                }}
              >
                increase in employee engagement
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: "center", mb: { xs: 8, md: 12 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.2rem", md: "3rem" },
              fontWeight: 800,
              mb: 3,
              color: "#1976d2",
              lineHeight: 1.2,
            }}
          >
            Powerful Features
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 720,
              mx: "auto",
              fontWeight: 400,
              lineHeight: 1.8,
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
                    borderRadius: 4,
                    boxShadow: "0 8px 28px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 36px rgba(0,0,0,0.12)",
                    },
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
                    {/* Icon */}
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 3,
                        background: alpha("#1976d2", 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                        color: "#1976d2",
                        fontSize: 30,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      }}
                    >
                      {feature.icon}
                    </Box>

                    {/* Feature Title */}
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        color: "#111",
                        fontSize: { xs: "1.25rem", md: "1.4rem" },
                      }}
                    >
                      {feature.title}
                    </Typography>

                    {/* Feature Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.7,
                        flexGrow: 1,
                        fontSize: "0.95rem",
                      }}
                    >
                      {feature.description}
                    </Typography>

                    {/* Learn More CTA */}
                    <Button
                      variant="text"
                      sx={{
                        mt: 3,
                        p: 0,
                        color: "#1976d2",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        textTransform: "none",
                        "&:hover": {
                          textDecoration: "underline",
                          color: "#115293",
                        },
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
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }} id="pricing">
        {/* Header */}
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
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Choose the plan that works best for your organization.
          </Typography>
        </Box>

        {/* Pricing Cards */}
        <Grid container spacing={6} justifyContent="center">
          {pricingPlans.map((plan, i) => {
            const isPopular = plan.title === "Pro"; // highlight Pro plan
            return (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: isPopular
                      ? "0 12px 40px rgba(102, 126, 234, 0.35)"
                      : "0 6px 20px rgba(0,0,0,0.08)",
                    border: isPopular
                      ? `2px solid ${alpha("#667eea", 0.5)}`
                      : "1px solid rgba(0,0,0,0.08)",
                    transform: isPopular ? "scale(1.05)" : "none",
                    transition: "all 0.3s ease",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: 12 },
                  }}
                >
                  <CardContent sx={{ p: 5, textAlign: "center" }}>
                    {/* Plan Title */}
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: isPopular ? "#667eea" : "text.primary",
                      }}
                    >
                      {plan.title}
                    </Typography>

                    {/* Price */}
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        mb: 2,
                        color: isPopular ? "#764ba2" : "text.primary",
                      }}
                    >
                      {plan.price}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", mb: 3 }}
                    >
                      {plan.description}
                    </Typography>

                    {/* Features List */}
                    <Stack spacing={1.5} sx={{ mb: 4 }}>
                      {plan.features.map((f, j) => (
                        <Typography
                          key={j}
                          variant="body2"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            fontWeight: 500,
                          }}
                        >
                          <Box component="span" sx={{ color: "#4caf50" }}>
                            ✅
                          </Box>
                          {f}
                        </Typography>
                      ))}
                    </Stack>

                    {/* CTA Button */}
                    <GradientButton sx={{ px: 5, py: 1.5 }}>
                      Get Started
                    </GradientButton>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* ✅ Footer */}
      <Box
        component="footer"
        sx={{
          py: { xs: 8, md: 12 },
          borderTop: "1px solid rgba(0,0,0,0.1)",
          mt: 10,
          backgroundColor: "#f8f9fa",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 6, md: 4 }}>
            {/* Logo + Tagline */}
            <Grid item xs={12} md={3}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 800, mb: 2, color: "#667eea" }}
              >
                Siga Systems
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 3 }}
              >
                Building modern SaaS platforms for productivity, collaboration,
                and scalable solutions.
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <IconButton
                  component={Link}
                  href="https://twitter.com"
                  target="_blank"
                  sx={{
                    color: "#1DA1F2",
                    bgcolor: alpha("#1DA1F2", 0.1),
                    "&:hover": { bgcolor: alpha("#1DA1F2", 0.2) },
                  }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  component={Link}
                  href="https://linkedin.com"
                  target="_blank"
                  sx={{
                    color: "#0A66C2",
                    bgcolor: alpha("#0A66C2", 0.1),
                    "&:hover": { bgcolor: alpha("#0A66C2", 0.2) },
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  component={Link}
                  href="https://github.com"
                  target="_blank"
                  sx={{
                    color: "#000",
                    bgcolor: alpha("#000", 0.05),
                    "&:hover": { bgcolor: alpha("#000", 0.1) },
                  }}
                >
                  <GitHubIcon />
                </IconButton>
              </Stack>
            </Grid>

            {/* Navigation Sections */}
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Docs"],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Contact"],
              },
              {
                title: "Resources",
                links: ["Blog", "Help Center", "API Docs"],
              },
              {
                title: "Legal",
                links: ["Terms of Service", "Privacy Policy", "Security"],
              },
            ].map((section, i) => (
              <Grid item xs={6} md={2} key={i}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                  {section.title}
                </Typography>
                <Stack spacing={1}>
                  {section.links.map((link, j) => (
                    <Link
                      key={j}
                      href="#"
                      underline="none"
                      color="text.secondary"
                      sx={{
                        "&:hover": { color: "#1976d2" },
                        display: "block",
                        fontSize: "0.95rem",
                      }}
                    >
                      {link}
                    </Link>
                  ))}
                </Stack>
              </Grid>
            ))}
          </Grid>

          {/* Bottom Row */}
          <Box
            sx={{
              textAlign: "center",
              mt: 8,
              color: "text.secondary",
              fontSize: "0.9rem",
            }}
          >
            &copy; {new Date().getFullYear()} Siga Systems Pvt. Ltd. All rights
            reserved. | Designed with ❤️ using React & MUI
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
