import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

const LoadingOverlay = ({ message, show }) => {
      if (!show) return null;

      return (
            <Box
                  sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        zIndex: 9999,
                  }}
            >
                  <Box
                        sx={{
                              bgcolor: "white",
                              borderRadius: 2,
                              p: 4,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 2,
                        }}
                  >
                        <CircularProgress />
                        <Typography variant="body1" color="text.secondary">
                              {message}
                        </Typography>
                  </Box>
            </Box>
      );
};

export default LoadingOverlay;
