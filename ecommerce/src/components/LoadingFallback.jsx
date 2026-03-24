import { BorderColor, ZoomIn } from "@mui/icons-material";
import { CircularProgress, Skeleton, Typography } from "@mui/material";
import React from "react";

export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  <Box>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <Box
        sx={{
          display: "flex",
          gap: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          p: 2,
        }}
      >
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            variant="rectangular"
            height={40}
            sx={{
              flexGrow: colIndex === 0 ? 0 : 1,
              width: colIndex === 0 ? 60 : "auto",
            }}
          />
        ))}
      </Box>
    ))}
  </Box>;
};

export const CardSkeleton = ({ count = 3 }) => {
  <Box>
    {Array.from({ length: count }).map((_, index) => (
      <Paper
        key={index}
        sx={{
          minWidth: 280,
          maxWidth: 340,
          p: 2,
        }}
      >
        <Skeleton
          variant="rectangular"
          height={140}
          sx={{
            mb: 2,
          }}
        />
        <Skeleton
          variant="text"
          height={32}
          sx={{
            mb: 1,
          }}
        />
        <Skeleton
          variant="text"
          height={20}
          sx={{
            mb: 1,
          }}
        />
        <Skeleton variant="text" height={20} width="60%" />
      </Paper>
    ))}
  </Box>;
};

export const ListSkeleton = ({ items = 5 }) => {
  <Box>
    {Array.from({ length: items }).map((_, index) => (
      <Box
        key={index}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          p: 2,
        }}
      >
        <Skeleton variant="circular" width={40} height={40} />
        <Box sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" height={24} width="40%" sx={{ mb: 1 }} />
          <Skeleton variant="text" height={16} width="60%" />
        </Box>
        <Skeleton variant="rectangular" height={32} width={80} />
      </Box>
    ))}
  </Box>;
};

export const LoadingFullback = ({
  type = "spinner",
  message = "Loading ... ",
  size = "medium",
}) => {
  const getSizeValue = () => {
    switch (size) {
      case "small":
        return 24;
      case "large":
        return 64;
      default:
        return 40;
    }
  };
  const renderContent = () => {
    switch (type) {
      case "spinner":
        return (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CircularProgress size={getSizeValue()} />
            {message && (
              <Typography variant="body2" color="text.secondary">
                {message}
              </Typography>
            )}
          </Box>
        );

      case "skeleton":
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {message}
            </Typography>
            <TableSkeleton />
          </Box>
        );

      case "card":
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {message}
            </Typography>
            <CardSkeleton />
          </Box>
        );

      case "list":
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {message}
            </Typography>
            <ListSkeleton />
          </Box>
        );

      default:
        return (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CircularProgress size={getSizeValue()} />
            {message && (
              <Typography variant="body2" color="text.secondary">
                {message}
              </Typography>
            )}
          </Box>
        );
    }
  };
};

return (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      p: 3,
      minHeight: 200,
    }}
  >
    {renderContent()}
  </Box>
);

export const FullPageLoading = ({ message = "Loading application.. " }) => (
  <Box
    sx={{
      display: "flex",
      gap: 2,
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      gap: 3,
    }}
  >
    <CircularProgress size={64} />
    <Typography variant="h6" color="text.secondary">
      {message}
    </Typography>
  </Box>
)
export const ButtonLoading = ({ loading, children, ...props }) => (
  <Box
    component="span"
    sx={{
      position: "relative",
    }}
  >
    <Button {...props} disabled={loading || props.disabled}>
      {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
      {children}
    </Button>
  </Box>
)

export const LoadingOverlay = ({
  loading,
  children,
  message = "Loading .. ",
}) => (
  <Box
    sx={{
      position: "relative",
    }}
  >
    {children}

    {loading && (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          flexDirection: "column",
          display: "flex",
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
          backgroundColor: "rgba(255,255,255, 0.8)",
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Box>
    )}
  </Box>
)
export default LoadingFallback;
