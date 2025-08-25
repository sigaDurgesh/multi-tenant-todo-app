import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

// ✅ Icons
import DomainIcon from "@mui/icons-material/Domain";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const steps = ["Organization Info", "Contact Details", "Confirmation"];

const BecomeTenant = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ✅ Form data
  const [formData, setFormData] = useState({
    organization: "",
    domain: "",
    contactPerson: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ Handle input change
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" }); // clear error when typing
  };

  // ✅ Validation rules
  const validateStep = () => {
    let newErrors = {};
    if (activeStep === 0) {
      if (!formData.organization.trim())
        newErrors.organization = "Organization name is required";
      if (!formData.domain.trim())
        newErrors.domain = "Domain is required";
    }
    if (activeStep === 1) {
      if (!formData.contactPerson.trim())
        newErrors.contactPerson = "Contact person is required";
      if (!formData.email.trim())
        newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Enter a valid email";
      if (!formData.phone.trim())
        newErrors.phone = "Phone number is required";
      else if (!/^\d{10}$/.test(formData.phone))
        newErrors.phone = "Enter a valid 10-digit phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (activeStep === steps.length - 1) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
      }, 1500);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Box
      sx={{
        py: 10,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f6f9ff 0%, #eef1ff 100%)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 900,
            mb: 6,
            color: "#1a237e",
          }}
        >
          Become a Tenant
        </Typography>

        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            backdropFilter: "blur(16px)",
            background: "rgba(255, 255, 255, 0.95)",
          }}
        >
          {/* Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Form Sections */}
          {!submitted ? (
            <>
              {activeStep === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Organization Name"
                      variant="outlined"
                      value={formData.organization}
                      onChange={(e) => handleChange("organization", e.target.value)}
                      error={!!errors.organization}
                      helperText={errors.organization}
                      InputProps={{
                        startAdornment: <BusinessIcon sx={{ mr: 1, color: "#5e35b1" }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Domain"
                      variant="outlined"
                      value={formData.domain}
                      onChange={(e) => handleChange("domain", e.target.value)}
                      error={!!errors.domain}
                      helperText={errors.domain}
                      InputProps={{
                        startAdornment: <DomainIcon sx={{ mr: 1, color: "#5e35b1" }} />,
                      }}
                    />
                  </Grid>
                </Grid>
              )}

              {activeStep === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Contact Person"
                      variant="outlined"
                      value={formData.contactPerson}
                      onChange={(e) => handleChange("contactPerson", e.target.value)}
                      error={!!errors.contactPerson}
                      helperText={errors.contactPerson}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1, color: "#5e35b1" }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      variant="outlined"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1, color: "#5e35b1" }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone"
                      type="tel"
                      variant="outlined"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      error={!!errors.phone}
                      helperText={errors.phone}
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ mr: 1, color: "#5e35b1" }} />,
                      }}
                    />
                  </Grid>
                </Grid>
              )}

              {activeStep === 2 && (
                <Box sx={{ textAlign: "center" }}>
                  <InfoOutlinedIcon sx={{ fontSize: 60, color: "#5e35b1", mb: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ color: "#333" }}>
                    Review your details and submit your tenant request.
                  </Typography>
                  <Typography sx={{ color: "#555", mt: 2 }}>
                    <strong>Organization:</strong> {formData.organization} <br />
                    <strong>Domain:</strong> {formData.domain} <br />
                    <strong>Contact:</strong> {formData.contactPerson} <br />
                    <strong>Email:</strong> {formData.email} <br />
                    <strong>Phone:</strong> {formData.phone}
                  </Typography>
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 5 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ color: "#5e35b1" }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={
                    loading ? <CircularProgress size={20} /> : <CheckCircleIcon />
                  }
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    px: 4,
                    py: 1.2,
                    fontWeight: 600,
                    borderRadius: 3,
                  }}
                  disabled={loading}
                >
                  {activeStep === steps.length - 1 ? "Submit" : "Next"}
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <CheckCircleIcon sx={{ fontSize: 80, color: "limegreen", mb: 3 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: "#1a237e" }}>
                Request Submitted!
              </Typography>
              <Typography variant="body1" sx={{ color: "#333" }}>
                Thank you for your request. Our team will review and contact you soon.
              </Typography>
            </Box>
          )}
        </Paper>

        {/* FAQ Section */}
        <Box sx={{ mt: 8 }}>
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 800, mb: 4, color: "#1a237e" }}
          >
            Frequently Asked Questions
          </Typography>
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>What is a Tenant?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                A tenant is your organization’s space in the application with dedicated users and resources.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>How long does approval take?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Approval usually takes 1–2 business days depending on verification.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Container>
    </Box>
  );
};

export default BecomeTenant;
