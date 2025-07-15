import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
      Container,
      Typography,
      Grid,
      Paper,
      Button,
      TextField,
      Box,
      FormControl,
      InputLabel,
      Select,
      MenuItem,
      RadioGroup,
      FormControlLabel,
      Radio,
      Divider,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaypalIcon from "@mui/icons-material/AttachMoney"; // Substitute a PayPal icon or any other relevant icon
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Checkout() {
      const [paymentMethod, setPaymentMethod] = useState("card");
      const [country, setCountry] = useState("United States");
      const [cartItems, setCartItems] = useState([]);
      const navigate = useNavigate();

      // Load cart items from localStorage
      useEffect(() => {
            const items = JSON.parse(localStorage.getItem("cart")) || [];
            setCartItems(items);
      }, []);

      // Calculate totals
      const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
      const tax = 1.0;
      const shipping = 5.0;
      const total = (subtotal + tax + shipping).toFixed(2);

      const handlePayment = async () => {
            try {
                  // Update product quantities
                  for (const item of cartItems) {
                        await axios.put(
                              `http://172.16.23.203:5000/api/objects/${item._id}/quantity`,
                              {
                                    quantity: item.quantity - 1,
                              }
                        );
                  }

                  // Update revenue and sold items
                  await axios.put("http://172.16.23.203:5000/api/revenue", {
                        amount: parseFloat(total),
                        items: cartItems.map((item) => ({
                              productId: item._id,
                              productName: item.productName,
                              price: item.price,
                        })),
                  });

                  // Clear cart
                  localStorage.removeItem("cart");

                  // Navigate to success page or home
                  navigate("/payment-success");
            } catch (error) {
                  console.error("Payment processing failed:", error);
                  alert("Payment processing failed. Please try again.");
            }
      };

      return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                  {/* Page Title & Optional Back Button */}
                  <Box mb={3} display="flex" alignItems="center">
                        <ArrowBackIcon
                              sx={{ mr: 2, cursor: "pointer" }}
                              onClick={() => navigate(-1)}
                        />
                        <Typography variant="h4" fontWeight="bold">
                              Checkout
                        </Typography>
                  </Box>

                  <Grid container spacing={3}>
                        {/* Left Column: Payment, Card Details, Billing Address */}
                        <Grid
                              item
                              xs={12}
                              md={8}
                              sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 3,
                              }}
                        >
                              {/* Payment Method */}
                              <Paper variant="outlined" sx={{ p: 3 }}>
                                    <Typography
                                          variant="h6"
                                          fontWeight="bold"
                                          gutterBottom
                                    >
                                          Payment Method
                                    </Typography>
                                    <RadioGroup
                                          row
                                          value={paymentMethod}
                                          onChange={(e) =>
                                                setPaymentMethod(e.target.value)
                                          }
                                          sx={{ gap: 2, mt: 2 }}
                                    >
                                          <FormControlLabel
                                                value="card"
                                                control={<Radio />}
                                                label={
                                                      <Box
                                                            display="flex"
                                                            alignItems="center"
                                                            gap={1}
                                                      >
                                                            <PaymentIcon />
                                                            <Typography>
                                                                  Credit Card
                                                            </Typography>
                                                      </Box>
                                                }
                                          />
                                          <FormControlLabel
                                                value="paypal"
                                                control={<Radio />}
                                                label={
                                                      <Box
                                                            display="flex"
                                                            alignItems="center"
                                                            gap={1}
                                                      >
                                                            <PaypalIcon />
                                                            <Typography>
                                                                  PayPal
                                                            </Typography>
                                                      </Box>
                                                }
                                          />
                                          <FormControlLabel
                                                value="wallet"
                                                control={<Radio />}
                                                label={
                                                      <Box
                                                            display="flex"
                                                            alignItems="center"
                                                            gap={1}
                                                      >
                                                            <AccountBalanceWalletIcon />
                                                            <Typography>
                                                                  Digital Wallet
                                                            </Typography>
                                                      </Box>
                                                }
                                          />
                                    </RadioGroup>
                              </Paper>

                              {/* Card Details */}
                              {paymentMethod === "card" && (
                                    <Paper variant="outlined" sx={{ p: 3 }}>
                                          <Typography
                                                variant="h6"
                                                fontWeight="bold"
                                                gutterBottom
                                          >
                                                Card Details
                                          </Typography>
                                          <TextField
                                                label="Card Number"
                                                fullWidth
                                                margin="normal"
                                                placeholder="1234 5678 9012 3456"
                                          />
                                          <TextField
                                                label="Name on Card"
                                                fullWidth
                                                margin="normal"
                                                placeholder="John Doe"
                                          />
                                          <Grid container spacing={2}>
                                                <Grid item xs={4}>
                                                      <TextField
                                                            label="Expiry Month"
                                                            placeholder="MM"
                                                            fullWidth
                                                      />
                                                </Grid>
                                                <Grid item xs={4}>
                                                      <TextField
                                                            label="Expiry Year"
                                                            placeholder="YYYY"
                                                            fullWidth
                                                      />
                                                </Grid>
                                                <Grid item xs={4}>
                                                      <TextField
                                                            label="CVV"
                                                            placeholder="123"
                                                            fullWidth
                                                      />
                                                </Grid>
                                          </Grid>
                                    </Paper>
                              )}

                              {/* If PayPal or Wallet chosen, you can show a relevant section here */}
                              {paymentMethod === "paypal" && (
                                    <Paper variant="outlined" sx={{ p: 3 }}>
                                          <Typography variant="body1">
                                                You will be redirected to PayPal
                                                to complete your payment.
                                          </Typography>
                                    </Paper>
                              )}
                              {paymentMethod === "wallet" && (
                                    <Paper variant="outlined" sx={{ p: 3 }}>
                                          <Typography variant="body1">
                                                Select your preferred digital
                                                wallet.
                                          </Typography>
                                    </Paper>
                              )}

                              {/* Billing Address */}
                              <Paper variant="outlined" sx={{ p: 3 }}>
                                    <Typography
                                          variant="h6"
                                          fontWeight="bold"
                                          gutterBottom
                                    >
                                          Billing Address
                                    </Typography>
                                    <TextField
                                          label="Cardholder Address"
                                          fullWidth
                                          margin="normal"
                                          placeholder="123 Main St"
                                    />
                                    <Grid container spacing={2}>
                                          <Grid item xs={6}>
                                                <TextField
                                                      label="City"
                                                      placeholder="New York"
                                                      fullWidth
                                                />
                                          </Grid>
                                          <Grid item xs={6}>
                                                <TextField
                                                      label="State"
                                                      placeholder="NY"
                                                      fullWidth
                                                />
                                          </Grid>
                                    </Grid>
                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                          <Grid item xs={6}>
                                                <TextField
                                                      label="ZIP Code"
                                                      placeholder="10001"
                                                      fullWidth
                                                />
                                          </Grid>
                                          <Grid item xs={6}>
                                                <FormControl fullWidth>
                                                      <InputLabel>
                                                            Country
                                                      </InputLabel>
                                                      <Select
                                                            value={country}
                                                            label="Country"
                                                            onChange={(e) =>
                                                                  setCountry(
                                                                        e.target
                                                                              .value
                                                                  )
                                                            }
                                                      >
                                                            <MenuItem value="United States">
                                                                  United States
                                                            </MenuItem>
                                                            <MenuItem value="Canada">
                                                                  Canada
                                                            </MenuItem>
                                                            <MenuItem value="Mexico">
                                                                  India
                                                            </MenuItem>
                                                            <MenuItem value="United Kingdom">
                                                                  United Kingdom
                                                            </MenuItem>
                                                      </Select>
                                                </FormControl>
                                          </Grid>
                                    </Grid>
                              </Paper>
                        </Grid>

                        {/* Right Column: Order Summary */}
                        <Grid
                              item
                              xs={12}
                              md={4}
                              sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 3,
                              }}
                        >
                              <Paper variant="outlined" sx={{ p: 3 }}>
                                    <Typography
                                          variant="h6"
                                          fontWeight="bold"
                                          gutterBottom
                                    >
                                          Order Summary
                                    </Typography>
                                    {cartItems.map((item, idx) => (
                                          <Box
                                                key={idx}
                                                display="flex"
                                                justifyContent="space-between"
                                                sx={{ mb: 1 }}
                                          >
                                                <Typography>
                                                      {item.productName}
                                                </Typography>
                                                <Typography>
                                                ₹{item.price.toFixed(2)}
                                                </Typography>
                                          </Box>
                                    ))}
                                    <Divider sx={{ my: 2 }} />
                                    <Box
                                          display="flex"
                                          justifyContent="space-between"
                                          mb={1}
                                    >
                                          <Typography>Subtotal</Typography>
                                          <Typography>
                                          ₹{subtotal.toFixed(2)}
                                          </Typography>
                                    </Box>
                                    <Box
                                          display="flex"
                                          justifyContent="space-between"
                                          mb={1}
                                    >
                                          <Typography>Tax</Typography>
                                          <Typography>
                                          ₹{tax.toFixed(2)}
                                          </Typography>
                                    </Box>
                                    <Box
                                          display="flex"
                                          justifyContent="space-between"
                                          mb={1}
                                    >
                                          <Typography>Shipping</Typography>
                                          <Typography>
                                          ₹{shipping.toFixed(2)}
                                          </Typography>
                                    </Box>
                                    <Divider sx={{ my: 2 }} />
                                    <Box
                                          display="flex"
                                          justifyContent="space-between"
                                          mb={2}
                                    >
                                          <Typography
                                                variant="h6"
                                                fontWeight="bold"
                                          >
                                                Total
                                          </Typography>
                                          <Typography
                                                variant="h6"
                                                fontWeight="bold"
                                          >
                                                ₹{total}
                                          </Typography>
                                    </Box>
                                    <Box
                                          display="flex"
                                          alignItems="center"
                                          sx={{ color: "gray" }}
                                    >
                                          <LockIcon
                                                fontSize="small"
                                                sx={{ mr: 1 }}
                                          />
                                          <Typography variant="body2">
                                                Secure checkout powered by
                                                Razorpay
                                          </Typography>
                                    </Box>
                                    <Button
                                          variant="contained"
                                          fullWidth
                                          sx={{ mt: 2 }}
                                          onClick={handlePayment}
                                          disabled={cartItems.length === 0}
                                    >
                                          Complete Payment
                                    </Button>
                              </Paper>

                              <Paper variant="outlined" sx={{ p: 3 }}>
                                    <Box
                                          display="flex"
                                          alignItems="center"
                                          mb={1}
                                    >
                                          <CheckCircleIcon
                                                color="success"
                                                sx={{ mr: 1 }}
                                          />
                                          <Typography fontWeight="bold">
                                                Satisfaction Guaranteed
                                          </Typography>
                                    </Box>
                                    <Typography
                                          variant="body2"
                                          color="text.secondary"
                                    >
                                          If you&apos;re not completely satisfied
                                          with your purchase, you can return it
                                          within 30 days for a full refund.
                                    </Typography>
                              </Paper>
                        </Grid>
                  </Grid>
            </Container>
      );
}
