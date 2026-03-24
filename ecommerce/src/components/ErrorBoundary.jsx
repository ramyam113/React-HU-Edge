
import { Home, Refresh } from "@mui/icons-material";
import { 
  Alert,
  Box,
  Button, 
  Paper,
  Typography 
} from "@mui/material";
import React, { useEffect, useState } from "react";

export default function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (error, errorInfo) => {
      setHasError(true);
      setError(error);
      console.log("Error caught by boundary", error, errorInfo);
    };

    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  const handleReset = () => {
    setHasError(false);
    setError(null);
  };

  const handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  if (hasError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          p: 2,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Paper
          sx={{
            p: 4,
            maxWidth: 500,
            textAlign: "center",
          }}
        >
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Application Error
            </Typography>
            <Typography variant="body2">
              Something went wrong. Please try again or return to dashboard
            </Typography>
          </Alert>
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              Error: {error?.message || "Unknown error"}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={handleReset}
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              startIcon={<Home />}
              onClick={handleGoHome}
            >
              Go to Dashboard
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }
  return children;
}
