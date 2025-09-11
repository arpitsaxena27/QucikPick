import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { pdf } from "@react-pdf/renderer";
import Receipt from "./Receipt";
const API_URL = import.meta.env.VITE_SERVER_URL || "http://172.16.23.203:5000";
import { selectMartId } from "../../store/slices/productsSlice";
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
      Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Checkout() {
      const [country, setCountry] = useState("India");
      const [cartItems, setCartItems] = useState([]);
      const [loading, setLoading] = useState(false);
      const [customerName, setCustomerName] = useState("");
      const [billingAddress, setBillingAddress] = useState("");
      const [city, setCity] = useState("");
      const [state, setState] = useState("");
      const navigate = useNavigate();
      const martId = useSelector(selectMartId); // Get martId from Redux store
      console.log("Mart ID from Redux:", martId);
      // Load cart items from localStorage
      useEffect(() => {
            const items = JSON.parse(localStorage.getItem("cart")) || [];
            console.log("Cart Items:", items); // Debug log
            setCartItems(items);
      }, []);

      // Calculate totals
      const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
      const tax = (2 / 100) * subtotal;
      const bag = 10.0;
      const total = (subtotal + tax + bag).toFixed(2);

      const loadRazorpay = () => {
            return new Promise((resolve) => {
                  const script = document.createElement("script");
                  script.src = "https://checkout.razorpay.com/v1/checkout.js";
                  script.onload = () => resolve(true);
                  script.onerror = () => resolve(false);
                  document.body.appendChild(script);
            });
      };

      const handlePayment = async () => {
            // Validate all required fields
            if (!customerName || !billingAddress || !city || !state) {
                  alert("Please fill in all required fields");
                  return;
            }

            try {
                  setLoading(true);

                  const res = await loadRazorpay();
                  if (!res) {
                        alert("Razorpay SDK failed to load");
                        return;
                  }

                  // Get Razorpay key
                  const keyResult = await axios.get(
                        `${API_URL}/api/payments/razorpay-key`,
                        {
                              withCredentials: true,
                        }
                  );
                  const key = keyResult.data.key;
                  console.log("Razorpay Key:", key);

                  // Create order
                  const orderResult = await axios.post(
                        `${API_URL}/api/payments/checkoutpay`,
                        {
                              amount: total,
                        },
                        {
                              headers: { "Content-Type": "application/json" },
                              withCredentials: true,
                        }
                  );
                  const order = orderResult.data.order;
                  console.log("Order:", order);

                  const options = {
                        key,
                        amount: order.amount,
                        currency: order.currency,
                        name: "Quick Pick",
                        description: "Payment for your order",
                        order_id: order.id,
                        handler: async (response) => {
                              try {
                                    if (
                                          !martId ||
                                          !customerName ||
                                          !billingAddress ||
                                          !city ||
                                          !state
                                    ) {
                                          alert("Missing required information");
                                          return;
                                    }

                                    // Construct full address
                                    const fullAddress = `${billingAddress}, ${city}, ${state}, ${country}`;

                                    const verificationPayload = {
                                          razorpay_payment_id:
                                                response.razorpay_payment_id,
                                          razorpay_order_id:
                                                response.razorpay_order_id,
                                          razorpay_signature:
                                                response.razorpay_signature,
                                          martId,
                                          items: cartItems,
                                          customerName,
                                          billingAddress: fullAddress,
                                          subtotal,
                                          tax,
                                          bag,
                                          amount: total,
                                          date: new Date().toLocaleString(),
                                    };

                                    console.log(
                                          "Sending verification payload:",
                                          verificationPayload
                                    );

                                    await axios.post(
                                          `${API_URL}/api/payments/verify`,
                                          verificationPayload,
                                          {
                                                headers: {
                                                      "Content-Type":
                                                            "application/json",
                                                },
                                                withCredentials: true,
                                          }
                                    );

                                    // Update product quantities
                                    for (const item of cartItems) {
                                          try {
                                                const newQuantity =
                                                      item.quantity - 1;
                                                await axios.patch(
                                                      `${API_URL}/api/mart/${item.martId}/shelves/${item.shelfNid}/products/${item._id}/quantity`,
                                                      {
                                                            quantity: newQuantity,
                                                      },
                                                      {
                                                            headers: {
                                                                  "Content-Type":
                                                                        "application/json",
                                                            },
                                                            withCredentials: true,
                                                      }
                                                );
                                          } catch (error) {
                                                console.error(
                                                      `Failed to update quantity for product ${item.productName}:`,
                                                      error
                                                );
                                                // Continue with other products even if one fails
                                          }
                                    }

                                    // Generate receipt data
                                    const receiptData = {
                                          razorpay_payment_id:
                                                response.razorpay_payment_id,
                                          razorpay_order_id:
                                                response.razorpay_order_id,
                                          customerName,
                                          billingAddress: fullAddress, // Using the fullAddress constructed earlier
                                          items: cartItems,
                                          total: total,
                                          subtotal: subtotal,
                                          tax: tax,
                                          bag: bag,
                                          date: new Date().toLocaleString(),
                                    };

                                    // Create a Blob containing the PDF
                                    const blob = await pdf(
                                          <Receipt orderData={receiptData} />
                                    ).toBlob();

                                    // Create form data to send the PDF
                                    const formData = new FormData();
                                    formData.append(
                                          "billPdf",
                                          new File(
                                                [blob],
                                                `receipt-${response.razorpay_payment_id}.pdf`,
                                                { type: "application/pdf" }
                                          )
                                    );
                                    formData.append(
                                          "paymentId",
                                          response.razorpay_payment_id
                                    );

                                    // Send PDF to backend
                                    try {
                                          await axios.post(
                                                `${API_URL}/api/payments/upload-bill`,
                                                formData,
                                                {
                                                      headers: {
                                                            "Content-Type":
                                                                  "multipart/form-data",
                                                      },
                                                      withCredentials: true,
                                                }
                                          );
                                          console.log(
                                                "Bill PDF uploaded successfully"
                                          );
                                    } catch (error) {
                                          console.error(
                                                "Failed to upload bill PDF:",
                                                error
                                          );
                                    }

                                    // Create a download link and trigger download
                                    const url = URL.createObjectURL(blob);
                                    const link = document.createElement("a");
                                    link.href = url;
                                    link.download = `receipt-${response.razorpay_payment_id}.pdf`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    URL.revokeObjectURL(url);

                                    // Clear cart
                                    localStorage.removeItem("cart");

                                    // Navigate to success page with receipt data
                                    navigate("/payment-success", {
                                          state: {
                                                receiptData,
                                                paymentId:
                                                      response.razorpay_payment_id,
                                                amount: total,
                                          },
                                    });
                              } catch (error) {
                                    console.error(
                                          "Payment verification failed:",
                                          {
                                                error,
                                                response: error.response?.data,
                                                status: error.response?.status,
                                                martId: martId,
                                                total: total,
                                          }
                                    );
                                    alert(
                                          `Payment verification failed: ${
                                                error.response?.data?.message ||
                                                error.message
                                          }`
                                    );
                              }
                        },
                        prefill: {
                              name: "Customer Name",
                              email: "customer@example.com",
                              contact: "9999999999",
                        },
                        theme: {
                              color: "#3f51b5",
                        },
                  };

                  const paymentObject = new window.Razorpay(options);
                  paymentObject.open();
            } catch (error) {
                  console.error("Payment initiation failed:", error);
                  alert("Payment initiation failed. Please try again.");
            } finally {
                  setLoading(false);
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
                              {/* Payment Information */}
                              <Paper variant="outlined" sx={{ p: 3 }}>
                                    <Typography
                                          variant="h6"
                                          fontWeight="bold"
                                          gutterBottom
                                    >
                                          Payment Information
                                    </Typography>
                                    <Typography
                                          variant="body1"
                                          color="text.secondary"
                                          sx={{ mb: 2 }}
                                    >
                                          You will be redirected to Razorpay's
                                          secure payment gateway to complete
                                          your payment.
                                    </Typography>
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
                                                Secure payment powered by
                                                Razorpay
                                          </Typography>
                                    </Box>
                              </Paper>

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
                                          label="Customer Name"
                                          fullWidth
                                          margin="normal"
                                          required
                                          value={customerName}
                                          onChange={(e) =>
                                                setCustomerName(e.target.value)
                                          }
                                          placeholder="John Doe"
                                          error={!customerName}
                                          helperText={
                                                !customerName
                                                      ? "Customer name is required"
                                                      : ""
                                          }
                                    />
                                    <TextField
                                          label="Street Address"
                                          fullWidth
                                          margin="normal"
                                          required
                                          value={billingAddress}
                                          onChange={(e) =>
                                                setBillingAddress(
                                                      e.target.value
                                                )
                                          }
                                          placeholder="123 Main St"
                                          error={!billingAddress}
                                          helperText={
                                                !billingAddress
                                                      ? "Street address is required"
                                                      : ""
                                          }
                                    />
                                    <Grid container spacing={2}>
                                          <Grid item xs={6}>
                                                <TextField
                                                      label="City"
                                                      placeholder="New York"
                                                      fullWidth
                                                      required
                                                      value={city}
                                                      onChange={(e) =>
                                                            setCity(
                                                                  e.target.value
                                                            )
                                                      }
                                                      error={!city}
                                                      helperText={
                                                            !city
                                                                  ? "City is required"
                                                                  : ""
                                                      }
                                                      margin="normal"
                                                />
                                          </Grid>
                                          <Grid item xs={6}>
                                                <TextField
                                                      label="State"
                                                      placeholder="NY"
                                                      fullWidth
                                                      required
                                                      value={state}
                                                      onChange={(e) =>
                                                            setState(
                                                                  e.target.value
                                                            )
                                                      }
                                                      error={!state}
                                                      helperText={
                                                            !state
                                                                  ? "State is required"
                                                                  : ""
                                                      }
                                                      margin="normal"
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
                                                            <MenuItem value="India">
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
                                          <Typography>Bag</Typography>
                                          <Typography>
                                                ₹{bag.toFixed(2)}
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
                                          disabled={
                                                cartItems.length === 0 ||
                                                loading ||
                                                !customerName ||
                                                !billingAddress ||
                                                !city ||
                                                !state
                                          }
                                    >
                                          {loading
                                                ? "Processing..."
                                                : "Pay Now"}
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
                                          If you&apos;re not completely
                                          satisfied with your purchase, you can
                                          return it within 30 days for a full
                                          refund.
                                    </Typography>
                              </Paper>
                        </Grid>
                  </Grid>
            </Container>
      );
}
