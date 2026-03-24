
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { AdminPanelSettings, LockOutlined } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isLoading, error, clearError } = useAuth();
  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by context
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper sx={{ width: "100%", p: 4 }} elevation={10}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{ m: 1, bgcolor: "primary.main", width: 56, height: 56 }}
            >
              <AdminPanelSettings fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h4" gutterBottom>
              Admin Login
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter your credentials to access the admin panel
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Divider sx={{ mb: 2 }} />

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={formData.username}
              autoComplete="username"
              autoFocus
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              autoComplete="current-password"
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={isLoading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              startIcon={
                isLoading ? <CircularProgress size={20} /> : <LockOutlined />
              }
            >
              {isLoading ? "Signing in..." : "Login"}
            </Button>
          </Box>
          <Box
            sx={{ mt: 3, p: 2, backgroundColor: "grey.100", borderRadius: 1 }}
          >
            <Typography color="text.secondary" variant="body2" gutterBottom>
              Demo Credentials:
            </Typography>
            <Typography component="div" variant="body2">
              Username: <code>admin</code> <br />
              Password: <code>admin123</code>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
