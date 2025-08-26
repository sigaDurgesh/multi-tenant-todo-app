import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
  Paper,
  IconButton,
  Fade,
  Slide,
  Zoom,
  useTheme,
  alpha,
  styled,
  keyframes,
} from "@mui/material";
import {
  Apartment,
  Security,
  Speed,
  Cloud,
  Analytics,
  CheckCircle,
  Star,
  ArrowForward,
  PlayArrow,
  Group,
  TrendingUp,
  AutoAwesome,
  Rocket,
  ShieldOutlined,
  FlashOn,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

// Custom styled components with animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.1); opacity: 0.9; }
  100% { transform: scale(1); opacity: 0.7; }
`;

const AnimatedBox = styled(Box)(({ theme }) => ({
  animation: `${float} 6s ease-in-out infinite`,
  "&:nth-of-type(2)": {
    animationDelay: "2s",
  },
  "&:nth-of-type(3)": {
    animationDelay: "4s",
  },
}));

const PulseBox = styled(Box)(({ theme }) => ({
  animation: `${pulse} 4s ease-in-out infinite`,
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: "50px",
  padding: "12px 32px",
  fontSize: "1.1rem",
  fontWeight: "bold",
  textTransform: "none",
  boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
    transform: "translateY(-4px) scale(1.02)",
    boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
  },
}));

const GlassCard = styled(Card)(({ theme }) => ({
  background: alpha("#ffffff", 0.08),
  backdropFilter: "blur(16px)",
  border: `1px solid ${alpha("#ffffff", 0.1)}`,
  borderRadius: "24px",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: alpha("#ffffff", 0.12),
    transform: "translateY(-12px) scale(1.02)",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    border: `1px solid ${alpha("#ffffff", 0.2)}`,
  },
}));

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setIsVisible(true);
    setTimeout(() => setStatsVisible(true), 1000);

    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Apartment sx={{ fontSize: 48 }} />,
      title: "Multi-Tenant Architecture",
      description:
        "Enterprise-grade multi-tenancy with complete data isolation, custom branding, and scalable infrastructure.",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#667eea",
    },
    {
      icon: <Security sx={{ fontSize: 48 }} />,
      title: "Military-Grade Security",
      description:
        "Advanced encryption, JWT authentication,SSO integration, compliance with SOC2,GDPR,and HIPAA.Grade",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      color: "#f093fb",
    },
    {
      icon: <Speed sx={{ fontSize: 48 }} />,
      title: "Lightning Performance",
      description:
        "Optimized React frontend, efficient caching, real-time update, and sub-second response time.Performance",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      color: "#4facfe",
    },
    {
      icon: <Cloud sx={{ fontSize: 48 }} />,
      title: "Cloud Native",
      description:
        "Deploy on AWS, Azure, GCP, or on-premises. Kubernetes ready with auto-scaling and loads balancing.Native ",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      color: "#43e97b",
    },
    {
      icon: <Analytics sx={{ fontSize: 48 }} />,
      title: "Advanced Analytics",
      description:
        "Real-time dashboards, productivity insights, team performance metrics, and AI-powered recommendation.",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      color: "#fa709a",
    },
    {
      icon: <AutoAwesome sx={{ fontSize: 48 }} />,
      title: "AI-Powered Automation",
      description:
        "Smart task prioritization, automated workflows, intelligent notifications, and predictive analytics.Automates",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      color: "#a8edea",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO at TechFlow Inc.",
      content:
        "This platform completely transformed our productivity. The multi-tenant architecture is flawless, and our team efficiency increased by 400%. Best investment we've ever made!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      company: "TechFlow Inc.",
    },
    {
      name: "Marcus Rodriguez",
      role: "Founder & CEO, InnovateLab",
      content:
        "The security features and scalability are exactly what we needed for our enterprise clients. Onboarding is seamless, and the support team is incredible.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      company: "InnovateLab",
    },
    {
      name: "Emily Watson",
      role: "VP of Engineering, DataSync",
      content:
        "Revolutionary platform! The real-time collaboration features and advanced analytics have completely changed how our global teams work together.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      company: "DataSync",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      period: "Forever",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 10 users",
        "Basic todo management",
        "Email support",
        "5GB storage",
        "Mobile apps",
      ],
      popular: false,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      name: "Professional",
      price: "$49",
      period: "/month",
      description: "Advanced features for growing businesses",
      features: [
        "Unlimited users",
        "Advanced analytics",
        "Priority support",
        "100GB storage",
        "Custom integrations",
        "SSO support",
      ],
      popular: true,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "Pricing",
      description: "Tailored solutions for large organizations",
      features: [
        "Dedicated infrastructure",
        "24/7 premium support",
        "Unlimited storage",
        "Advanced security",
        "Custom SLA",
        "White-label solution",
      ],
      popular: false,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
  ];

  const stats = [
    { number: "100K+", label: "Active Users", icon: <Group /> },
    { number: "99.99%", label: "Uptime SLA", icon: <ShieldOutlined /> },
    { number: "2M+", label: "Tasks Completed", icon: <CheckCircle /> },
    { number: "180+", label: "Countries", icon: <TrendingUp /> },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0c1426 0%, #1a1a2e 50%, #16213e 100%)",
        color: "white",
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "fixed", inset: 0, zIndex: 0, opacity: 0.1 }}>
        <AnimatedBox
          sx={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            filter: "blur(100px)",
          }}
        />
        <AnimatedBox
          sx={{
            position: "absolute",
            top: "60%",
            right: "10%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            filter: "blur(120px)",
          }}
        />
        <AnimatedBox
          sx={{
            position: "absolute",
            bottom: "10%",
            left: "30%",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            filter: "blur(110px)",
          }}
        />
      </Box>

      {/* Hero Section */}
      <Container
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 1, pt: 8, pb: 8 }}
      >
        <Fade in={isVisible} timeout={1000}>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Chip
              icon={<Star sx={{ color: "#ffd700 !important" }} />}
              label="Trusted by 100K+ organizations worldwide"
              sx={{
                mb: 4,
                px: 2,
                py: 1,
                background: alpha("#ffffff", 0.1),
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "white",
                fontSize: "1rem",
                "& .MuiChip-icon": { color: "#ffd700" },
              }}
            />

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "3rem", sm: "4rem", md: "6rem", lg: "7rem" },
                fontWeight: 900,
                lineHeight: 0.9,
                mb: 3,
                background:
                  "linear-gradient(135deg, #ffffff 0%, #667eea 50%, #f093fb 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              The Future of
              <br />
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #f093fb 50%, #4facfe 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Team Productivity
              </Box>
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" },
                color: alpha("#ffffff", 0.8),
                mb: 6,
                maxWidth: "800px",
                mx: "auto",
                lineHeight: 1.4,
                fontWeight: 300,
              }}
            >
              Revolutionary multi-tenant platform that transforms how
              organizations manage tasks, users, and workflows. Built for scale,
              designed for excellence.
            </Typography>

            {/* ✅ Buttons Section */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 8 }}
            >
              {!user ? (
                // If not logged in → show Login
                <div>
                  <Button
                  size="large"
                  variant="contained"
                  sx={{
                    borderRadius: "50px",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    background:
                      "linear-gradient(135deg, #d3e910a9 0%, #43c8cfff 100%)",
                  }}
                  onClick={() => navigate("/register")}
                >
                  SignIn
                </Button>
                  
                <Button
                  size="large"
                  variant="contained"
                  sx={{
                    borderRadius: "50px",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    background:
                      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                </div>
              ) : user.role === "user" ? (
                // If logged in as normal user → show Become Tenant
                <Stack
                  direction={{ xs: "column", sm: "row" }} // column on mobile, row on desktop
                  spacing={3}
                  justifyContent="center"
                  alignItems="center"
                >
                  {/* ✅ Become a Tenant */}
                  <Button
                    size="large"
                    sx={{
                      background:
                        "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                      color: "white",
                      borderRadius: "50px",
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      minWidth: 200,
                      boxShadow: "0 8px 32px rgba(255, 107, 107, 0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px) scale(1.02)",
                        boxShadow: "0 12px 40px rgba(255, 107, 107, 0.4)",
                      },
                    }}
                    onClick={() => navigate("/becometenant")}
                  >
                    Become a Tenant
                  </Button>

                  {/* ✅ Go to Workspace */}
                  <Button
                    size="large"
                    sx={{
                      background:
                        "linear-gradient(135deg, #38ef7d 0%, #11998e 100%)",
                      color: "white",
                      borderRadius: "50px",
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      minWidth: 200,
                      boxShadow: "0 8px 32px rgba(17, 153, 142, 0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px) scale(1.02)",
                        boxShadow: "0 12px 40px rgba(17, 153, 142, 0.4)",
                      },
                    }}
                    onClick={() => navigate("/user/todos")}
                  >
                    Go to Workspace
                  </Button>
                </Stack>
              ) : (
                // If already a tenant / admin → show Dashboard
                <Button
                  size="large"
                  sx={{
                    background:
                      "linear-gradient(135deg, #38ef7d 0%, #11998e 100%)",
                    color: "white",
                    borderRadius: "50px",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    textTransform: "none",
                    minWidth: 200,
                    boxShadow: "0 8px 32px rgba(17, 153, 142, 0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px) scale(1.02)",
                      boxShadow: "0 12px 40px rgba(17, 153, 142, 0.4)",
                    },
                  }}
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </Button>
              )}
            </Stack>
          </Box>
        </Fade>

        {/* Stats Section (unchanged) */}
        <Slide in={statsVisible} direction="up" timeout={1000}>
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Zoom in={statsVisible} timeout={1000 + index * 200}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: "center",
                      background: alpha("#ffffff", 0.05),
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: 3,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: alpha("#ffffff", 0.1),
                        transform: "translateY(-8px)",
                      },
                    }}
                  >
                    <Box sx={{ color: "#667eea", mb: 1 }}>{stat.icon}</Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 900,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #f093fb 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 1,
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: alpha("#ffffff", 0.7) }}
                    >
                      {stat.label}
                    </Typography>
                  </Paper>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Slide>
      </Container>

      {/* 🚀 Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
        {/* 🌟 Section Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 8, md: 12 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.2rem", md: "3.2rem" },
              fontWeight: 800,
              mb: 3,
              background: "linear-gradient(135deg, #ffffff 0%, #667eea 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
            }}
          >
            Powerful Features
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: alpha("#ffffff", 0.75),
              maxWidth: 700,
              mx: "auto",
              fontWeight: 400,
              lineHeight: 1.7,
              fontSize: { xs: "1rem", md: "1.15rem" },
            }}
          >
            Everything you need to build, scale, and manage your organization's
            productivity — all in one beautifully designed platform.
          </Typography>
        </Box>

        {/* 🚀 Features Grid */}
        <Grid
          container
          spacing={{ xs: 4, md: 6 }}
          justifyContent="center"
          alignItems="stretch"
        >
          {features.map((feature, index) => (
            <Grid
              item
              xs={12} // 1 per row mobile
              sm={6} // 2 per row tablet
              md={4} // 3 per row desktop
              key={index}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Zoom in timeout={700 + index * 200}>
                <GlassCard
                  sx={{
                    flex: 1,
                    maxWidth: 360, // ✅ reduced width
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 4,
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                    transition: "all 0.4s ease",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: { xs: 4, md: 5 },
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Icon */}
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 3,
                        background: feature.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 4,
                        color: "white",
                        fontSize: 42,
                        transition: "all 0.3s ease",
                        "&:hover": { transform: "scale(1.1) rotate(6deg)" },
                      }}
                    >
                      {feature.icon}
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: "white",
                        fontSize: { xs: "1.3rem", md: "1.6rem" },
                      }}
                    >
                      {feature.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body1"
                      sx={{
                        color: alpha("#ffffff", 0.85),
                        lineHeight: 1.7,
                        fontSize: "0.95rem",
                        flexGrow: 1, // ✅ pushes button to bottom
                      }}
                    >
                      {feature.description}
                    </Typography>

                    {/* CTA */}
                    <Button
                      variant="text"
                      sx={{
                        mt: 3,
                        alignSelf: "flex-start",
                        color: "#667eea",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        textTransform: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      Learn More →
                    </Button>
                  </CardContent>
                </GlassCard>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ⭐ Testimonials Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: alpha("#ffffff", 0.03) }}>
        <Container maxWidth="lg">
          {/* Section Title */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "3.5rem" },
              fontWeight: 800,
              textAlign: "center",
              mb: { xs: 6, md: 10 },
              background: "linear-gradient(135deg, #ffffff 0%, #667eea 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
            }}
          >
            Loved by Industry Leaders
          </Typography>

          {/* Testimonials Card */}
          <Box sx={{ position: "relative", maxWidth: 900, mx: "auto" }}>
            {testimonials.map((testimonial, index) => (
              <Fade key={index} in={index === activeTestimonial} timeout={600}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 4, md: 6 },
                    background: alpha("#ffffff", 0.07),
                    backdropFilter: "blur(18px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 4,
                    textAlign: "center",
                    display: index === activeTestimonial ? "block" : "none",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
                  }}
                >
                  {/* ⭐ Rating */}
                  <Stack direction="row" justifyContent="center" sx={{ mb: 3 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} sx={{ color: "#ffd700", fontSize: 30 }} />
                    ))}
                  </Stack>

                  {/* Testimonial Text */}
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 4,
                      fontStyle: "italic",
                      color: "white",
                      lineHeight: 1.6,
                      fontSize: { xs: "1.1rem", md: "1.4rem" },
                      maxWidth: 700,
                      mx: "auto",
                    }}
                  >
                    "{testimonial.content}"
                  </Typography>

                  {/* Author Info */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={3}
                  >
                    <Avatar
                      src={testimonial.avatar}
                      sx={{
                        width: 70,
                        height: 70,
                        border: "3px solid #667eea",
                      }}
                    />
                    <Box sx={{ textAlign: "left" }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "white", mb: 0.5 }}
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: alpha("#ffffff", 0.8) }}
                      >
                        {testimonial.role}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: alpha("#ffffff", 0.6) }}
                      >
                        {testimonial.company}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Fade>
            ))}

            {/* Pagination Dots */}
            <Stack
              direction="row"
              justifyContent="center"
              spacing={1.5}
              sx={{ mt: 5 }}
            >
              {testimonials.map((_, index) => (
                <IconButton
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  sx={{
                    width: 14,
                    height: 14,
                    p: 0,
                    backgroundColor:
                      index === activeTestimonial
                        ? "#667eea"
                        : alpha("#ffffff", 0.4),
                    borderRadius: "50%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#667eea",
                      transform: "scale(1.15)",
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Container maxWidth="lg" sx={{ py: 14 }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "4rem" },
              fontWeight: 900,
              mb: 3,
              background: "linear-gradient(135deg, #ffffff 0%, #667eea 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Choose Your Plan
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: alpha("#ffffff", 0.7), maxWidth: 600, mx: "auto" }}
          >
            Flexible pricing for teams of all sizes. Start free, scale as you
            grow.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {pricingPlans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Zoom in timeout={1000 + index * 200}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: "100%",
                    background: plan.popular
                      ? alpha("#667eea", 0.1)
                      : alpha("#ffffff", 0.05),
                    backdropFilter: "blur(16px)",
                    border: plan.popular
                      ? "2px solid #667eea"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 4,
                    position: "relative",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-12px) scale(1.02)",
                      background: plan.popular
                        ? alpha("#667eea", 0.15)
                        : alpha("#ffffff", 0.1),
                    },
                  }}
                >
                  {plan.popular && (
                    <Chip
                      label="Most Popular"
                      sx={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #f093fb 100%)",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                  )}

                  <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: "white", mb: 2 }}
                    >
                      {plan.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: alpha("#ffffff", 0.7), mb: 3 }}
                    >
                      {plan.description}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="h2"
                        sx={{
                          fontWeight: 900,
                          color: "white",
                          background: plan.gradient,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {plan.price}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: alpha("#ffffff", 0.7), ml: 1 }}
                      >
                        {plan.period}
                      </Typography>
                    </Box>
                  </Box>

                  <Stack spacing={2} sx={{ mb: 4 }}>
                    {plan.features.map((feature, featureIndex) => (
                      <Stack
                        key={featureIndex}
                        direction="row"
                        alignItems="center"
                        spacing={2}
                      >
                        <CheckCircle sx={{ color: "#43e97b", fontSize: 20 }} />
                        <Typography
                          variant="body1"
                          sx={{ color: alpha("#ffffff", 0.8) }}
                        >
                          {feature}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <Button
                    fullWidth
                    size="large"
                    sx={{
                      background: plan.popular ? plan.gradient : "transparent",
                      border: plan.popular
                        ? "none"
                        : "2px solid rgba(255, 255, 255, 0.2)",
                      color: "white",
                      borderRadius: "50px",
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: plan.popular
                          ? "0 12px 40px rgba(102, 126, 234, 0.4)"
                          : "0 8px 32px rgba(255, 255, 255, 0.1)",
                        background: plan.popular
                          ? plan.gradient
                          : alpha("#ffffff", 0.1),
                      },
                    }}
                  >
                    {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </Button>
                </Paper>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 🚀 Call-to-Action Section */}
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          background:
            "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(240, 147, 251, 0.15) 100%)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          {/* Heading */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.2rem", md: "3.5rem" },
              fontWeight: 900,
              mb: 3,
              color: "white",
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
            }}
          >
            Supercharge Your Productivity Today 🚀
          </Typography>

          {/* Subheading */}
          <Typography
            variant="h6"
            sx={{
              color: alpha("#ffffff", 0.85),
              mb: 6,
              maxWidth: 640,
              mx: "auto",
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Join thousands of modern teams who trust{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "#667eea" }}>
              Multi-Tenant Todo
            </Box>{" "}
            to collaborate smarter, move faster, and get more done with less
            effort.
          </Typography>

          {/* Action Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            {/* Primary CTA */}
            <GradientButton
              size="large"
              endIcon={<Rocket />}
              sx={{
                minWidth: 220,
                py: 1.6,
                fontSize: "1.1rem",
                fontWeight: 700,
                borderRadius: "50px",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px) scale(1.02)",
                  boxShadow: "0 12px 40px rgba(102,126,234,0.35)",
                },
              }}
            >
              Start Free Trial
            </GradientButton>

            {/* Secondary CTA */}
            <Button
              size="large"
              sx={{
                color: "white",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "50px",
                px: 4,
                py: 1.5,
                fontSize: "1.05rem",
                fontWeight: 600,
                textTransform: "none",
                backdropFilter: "blur(16px)",
                background: alpha("#ffffff", 0.05),
                minWidth: 200,
                transition: "all 0.3s ease",
                "&:hover": {
                  background: alpha("#ffffff", 0.15),
                  transform: "translateY(-4px)",
                  border: "2px solid rgba(255, 255, 255, 0.6)",
                  boxShadow: "0 12px 40px rgba(255, 255, 255, 0.15)",
                },
              }}
            >
              Schedule Demo
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* 🌙 Footer */}
      <Box
        component="footer"
        sx={{
          py: { xs: 6, md: 10 },
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          mt: 8,
          background: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} justifyContent="space-between">
            {/* Brand Section */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    mb: 2,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #f093fb 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Multi-Tenant Todo
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: alpha("#ffffff", 0.75), mb: 1 }}
                >
                  The future of team productivity and collaboration.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: alpha("#ffffff", 0.5) }}
                >
                  Built with ❤️ for the modern workforce.
                </Typography>
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  textAlign: { xs: "center", md: "center" },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    mb: 2,
                    fontSize: "1.1rem",
                  }}
                >
                  Quick Links
                </Typography>
                <Stack
                  direction="row"
                  spacing={3}
                  justifyContent={{ xs: "center", md: "center" }}
                  sx={{ flexWrap: "wrap", gap: 2 }}
                >
                  {["Privacy Policy", "Terms of Service", "Contact"].map(
                    (link, i) => (
                      <Typography
                        key={i}
                        variant="body2"
                        sx={{
                          color: alpha("#ffffff", 0.6),
                          cursor: "pointer",
                          transition: "color 0.3s ease",
                          "&:hover": { color: "#667eea" },
                        }}
                      >
                        {link}
                      </Typography>
                    )
                  )}
                </Stack>
              </Box>
            </Grid>

            {/* Socials */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: { xs: "center", md: "right" } }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    mb: 2,
                    fontSize: "1.1rem",
                  }}
                >
                  Follow Us
                </Typography>
                <Stack
                  direction="row"
                  spacing={3}
                  justifyContent={{ xs: "center", md: "flex-end" }}
                >
                  <IconButton
                    sx={{
                      color: alpha("#ffffff", 0.6),
                      transition: "all 0.3s ease",
                      "&:hover": { color: "#667eea", transform: "scale(1.2)" },
                    }}
                  >
                    <i className="fab fa-github" />
                  </IconButton>
                  <IconButton
                    sx={{
                      color: alpha("#ffffff", 0.6),
                      transition: "all 0.3s ease",
                      "&:hover": { color: "#667eea", transform: "scale(1.2)" },
                    }}
                  >
                    <i className="fab fa-twitter" />
                  </IconButton>
                  <IconButton
                    sx={{
                      color: alpha("#ffffff", 0.6),
                      transition: "all 0.3s ease",
                      "&:hover": { color: "#667eea", transform: "scale(1.2)" },
                    }}
                  >
                    <i className="fab fa-linkedin" />
                  </IconButton>
                </Stack>
              </Box>
            </Grid>
          </Grid>

          {/* Bottom Bar */}
          <Box
            sx={{
              textAlign: "center",
              mt: { xs: 6, md: 8 },
              color: alpha("#ffffff", 0.5),
              fontSize: "0.9rem",
            }}
          >
            &copy; {new Date().getFullYear()} Multi-Tenant Todo App. All rights
            reserved.
          </Box>
        </Container>
      </Box>

      {/* Floating Action Elements */}
      <PulseBox
        sx={{
          position: "fixed",
          top: "20%",
          left: "5%",
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      <PulseBox
        sx={{
          position: "fixed",
          bottom: "30%",
          right: "8%",
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          opacity: 0.4,
          zIndex: 0,
          animationDelay: "2s",
        }}
      />
    </Box>
  );
};

export default LandingPage;
