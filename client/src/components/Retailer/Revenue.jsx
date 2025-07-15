import React from "react";
import { Card, CardContent, Typography, Grid, Box, Divider, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AnimatedCard = styled(Card)({
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.3)",
  },
  borderRadius: "12px",
  backgroundColor: "#FFC220",
  padding: "16px",
});

const Revenue = () => {
  const navigate = useNavigate();
  
  const totalSales = 500000; 
  const totalStock = 1200;
  const totalStoreValue = 200000;
  const itemsSold = [
    { name: "Laptop", quantity: 50, revenue: 75000 },
    { name: "Mobile", quantity: 100, revenue: 50000 },
    { name: "Headphones", quantity: 200, revenue: 30000 },
    { name: "TV", quantity: 30, revenue: 45000 },
    { name: "Smart Watch", quantity: 80, revenue: 16000 },
  ];

  return (
    <Box sx={{ p: 4, backgroundColor: "#0c3e7b", minHeight: "100vh", position: "relative" }}>
      
      {/* Circular Back Button */}
      <IconButton 
        onClick={() => navigate(-1)} 
        sx={{ 
          position: "absolute", 
          top: "16px", 
          left: "16px", 
          backgroundColor: "white", 
          color: "#0c3e7b", 
          "&:hover": { backgroundColor: "#e0e0e0" },
          width: "45px",
          height: "45px",
          borderRadius: "50%",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)"
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
          mb: 4,
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        Revenue Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} justifyContent="center">
        {[
          { title: "Total Sales", value: `$${totalSales.toLocaleString()}` },
          { title: "Stock Left", value: totalStock },
          { title: "Store Value", value: `$${totalStoreValue.toLocaleString()}` },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <AnimatedCard>
              <CardContent>
                <Typography variant="h6" sx={{ color: "#000", fontWeight: "bold" }}>{stat.title}</Typography>
                <Typography variant="h4" sx={{ color: "#000", fontWeight: "bold" }}>{stat.value}</Typography>
              </CardContent>
            </AnimatedCard>
          </Grid>
        ))}
      </Grid>

      {/* Items Sold */}
      <Box sx={{ mt: 5 }}>
        <Typography
          variant="h5"
          sx={{
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            mb: 3,
            textTransform: "uppercase",
          }}
        >
          Items Sold
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {itemsSold.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <AnimatedCard>
                <CardContent>
                  <Typography variant="h6" sx={{ color: "#000", fontWeight: "bold" }}>
                    {item.name}
                  </Typography>
                  <Divider sx={{ my: 1, backgroundColor: "#000" }} />
                  <Typography sx={{ color: "#000" }}>Quantity Sold: <strong>{item.quantity}</strong></Typography>
                  <Typography sx={{ color: "#000" }}>Revenue: <strong>${item.revenue.toLocaleString()}</strong></Typography>
                </CardContent>
              </AnimatedCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Revenue;
