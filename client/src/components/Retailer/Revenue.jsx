import PropTypes from "prop-types";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
      Box,
      Paper,
      Typography,
      Table,
      TableBody,
      TableCell,
      TableContainer,
      TableHead,
      TableRow,
      TablePagination,
      Card,
      CardContent,
      Grid,
      CircularProgress,
      Tooltip,
      IconButton,
      Button,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
      PaidOutlined,
      ShoppingCartOutlined,
      TrendingUpOutlined,
      CalendarMonthOutlined,
} from "@mui/icons-material";
import {
      Chart as ChartJS,
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip as ChartTooltip,
      Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      ChartTooltip,
      Legend
);

const API_URL = import.meta.env.VITE_SERVER_URL || "http://172.16.23.203:5000";

const StatCard = ({ title, value, icon, color }) => (
      <Card sx={{ height: "100%" }}>
            <CardContent>
                  <Box
                        sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                        }}
                  >
                        <Box>
                              <Typography
                                    color="textSecondary"
                                    variant="subtitle2"
                                    gutterBottom
                              >
                                    {title}
                              </Typography>
                              <Typography variant="h4" sx={{ color: color }}>
                                    {typeof value === "number"
                                          ? `₹${value.toFixed(2)}`
                                          : value}
                              </Typography>
                        </Box>
                        <Box
                              sx={{
                                    backgroundColor: `${color}20`,
                                    borderRadius: "50%",
                                    padding: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                              }}
                        >
                              {icon}
                        </Box>
                  </Box>
            </CardContent>
      </Card>
);

StatCard.propTypes = {
      title: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
            .isRequired,
      icon: PropTypes.node.isRequired,
      color: PropTypes.string.isRequired,
};

const Revenue = () => {
      const navigate = useNavigate();

      const handleBackToMap = () => {
            navigate("/retailer-map");
      };

      // Function to handle PDF view
      const handleViewPDF = async (paymentId) => {
            try {
                  const response = await axios.get(
                        `${API_URL}/api/payments/bill/${paymentId}`,
                        {
                              withCredentials: true,
                        }
                  );

                  if (
                        response.data.success &&
                        response.data.billPdf.secure_url
                  ) {
                        window.open(response.data.billPdf.secure_url, "_blank");
                  }
            } catch (error) {
                  console.error("Error fetching bill:", error);
                  // You might want to add a toast/snackbar here to show the error
            }
      };
      const [payments, setPayments] = useState([]);
      const [loading, setLoading] = useState(true);
      const [page, setPage] = useState(0);
      const [rowsPerPage, setRowsPerPage] = useState(10);
      const [analytics, setAnalytics] = useState({
            monthWise: {},
            monthlySalesCount: [],
            monthlySalesAmount: [],
      });
      const [totalCount, setTotalCount] = useState(0);

      useEffect(() => {
            fetchPayments();
      }, []);

      const fetchPayments = async () => {
            try {
                  setLoading(true);
                  const response = await axios.get(`${API_URL}/api/payments`, {
                        withCredentials: true,
                  });

                  console.log(response.data);

                  const {
                        allPayments,
                        analytics: analyticsData,
                        totalCount: total,
                  } = response.data;

                  // Format payment data
                  const formattedPayments = allPayments.map((payment) => ({
                        ...payment,
                        amountInRupees: payment.amount / 100,
                        feeInRupees: payment.fee / 100,
                        taxInRupees: payment.tax / 100,
                  }));

                  setPayments(formattedPayments);
                  setAnalytics(analyticsData);
                  setTotalCount(total);
            } catch (error) {
                  console.error("Error fetching payments:", error);
            } finally {
                  setLoading(false);
            }
      };

      const handleChangePage = (event, newPage) => {
            setPage(newPage);
      };

      const handleChangeRowsPerPage = (event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
      };

      const formatDate = (timestamp) => {
            return new Date(timestamp * 1000).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
            });
      };

      const getTotalRevenue = () => {
            // Convert paisa to rupees for display
            return analytics.monthlySalesAmount.reduce(
                  (sum, amount) => sum + amount,
                  0
            );
      };

      const getAverageOrderValue = () => {
            const totalRevenue = getTotalRevenue();
            return totalCount > 0 ? totalRevenue / totalCount : 0;
      };

      if (loading) {
            return (
                  <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="400px"
                  >
                        <CircularProgress />
                  </Box>
            );
      }

      return (
            <Box sx={{ p: 3 }}>
                  {/* Back Button */}
                  <Box sx={{ mb: 3 }}>
                        <Button
                              variant="contained"
                              color="primary"
                              onClick={handleBackToMap}
                              sx={{
                                    bgcolor: "#0071DC",
                                    "&:hover": {
                                          bgcolor: "#005bb1",
                                    },
                              }}
                        >
                              Back to Mart
                        </Button>
                  </Box>

                  {/* Monthly Sales Chart */}
                  <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                              Monthly Sales Overview
                        </Typography>
                        <Box sx={{ height: 300 }}>
                              <Line
                                    data={{
                                          labels: [
                                                "January",
                                                "February",
                                                "March",
                                                "April",
                                                "May",
                                                "June",
                                                "July",
                                                "August",
                                                "September",
                                                "October",
                                                "November",
                                                "December",
                                          ],
                                          datasets: [
                                                {
                                                      label: "Sales Amount (₹)",
                                                      data: analytics.monthlySalesAmount,
                                                      borderColor: "#0071DC",
                                                      backgroundColor:
                                                            "#0071DC20",
                                                      tension: 0.3,
                                                },
                                                {
                                                      label: "Number of Orders",
                                                      data: analytics.monthlySalesCount,
                                                      borderColor: "#FFC220",
                                                      backgroundColor:
                                                            "#FFC22020",
                                                      tension: 0.3,
                                                },
                                          ],
                                    }}
                                    options={{
                                          responsive: true,
                                          maintainAspectRatio: false,
                                          plugins: {
                                                legend: {
                                                      position: "top",
                                                },
                                                title: {
                                                      display: false,
                                                },
                                          },
                                          scales: {
                                                y: {
                                                      beginAtZero: true,
                                                      ticks: {
                                                            callback: (value) =>
                                                                  `₹${value}`,
                                                      },
                                                },
                                          },
                                    }}
                              />
                        </Box>
                  </Paper>

                  {/* Stats Cards */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6} md={3}>
                              <StatCard
                                    title="Total Revenue"
                                    value={getTotalRevenue()}
                                    icon={
                                          <PaidOutlined
                                                sx={{
                                                      color: "#0071DC",
                                                      fontSize: 40,
                                                }}
                                          />
                                    }
                                    color="#0071DC"
                              />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                              <StatCard
                                    title="Total Orders"
                                    value={totalCount}
                                    icon={
                                          <ShoppingCartOutlined
                                                sx={{
                                                      color: "#FFC220",
                                                      fontSize: 40,
                                                }}
                                          />
                                    }
                                    color="#FFC220"
                              />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                              <StatCard
                                    title="Average Order Value"
                                    value={getAverageOrderValue()}
                                    icon={
                                          <TrendingUpOutlined
                                                sx={{
                                                      color: "#0071DC",
                                                      fontSize: 40,
                                                }}
                                          />
                                    }
                                    color="#0071DC"
                              />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                              <StatCard
                                    title="Active Months"
                                    value={
                                          Object.keys(analytics.monthWise || {})
                                                .length
                                    }
                                    icon={
                                          <CalendarMonthOutlined
                                                sx={{
                                                      color: "#FFC220",
                                                      fontSize: 40,
                                                }}
                                          />
                                    }
                                    color="#9c27b0"
                              />
                        </Grid>
                  </Grid>

                  {/* Payments Table */}
                  <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                              <Table stickyHeader>
                                    <TableHead>
                                          <TableRow>
                                                <TableCell>
                                                      Payment ID
                                                </TableCell>
                                                <TableCell>Order ID</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Amount</TableCell>
                                                <TableCell>Method</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Fee</TableCell>
                                                <TableCell>Contact</TableCell>
                                                <TableCell>Bill</TableCell>
                                          </TableRow>
                                    </TableHead>
                                    <TableBody>
                                          {payments
                                                .slice(
                                                      page * rowsPerPage,
                                                      page * rowsPerPage +
                                                            rowsPerPage
                                                )
                                                .map((payment) => (
                                                      <TableRow
                                                            hover
                                                            key={payment.id}
                                                      >
                                                            <TableCell>
                                                                  {payment.id}
                                                            </TableCell>
                                                            <TableCell>
                                                                  {
                                                                        payment.order_id
                                                                  }
                                                            </TableCell>
                                                            <TableCell>
                                                                  {formatDate(
                                                                        payment.created_at
                                                                  )}
                                                            </TableCell>
                                                            <TableCell>
                                                                  ₹
                                                                  {payment.amountInRupees.toFixed(
                                                                        2
                                                                  )}
                                                            </TableCell>
                                                            <TableCell>
                                                                  <Tooltip
                                                                        title={
                                                                              payment.upi
                                                                                    ? `UPI ID: ${payment.vpa}`
                                                                                    : ""
                                                                        }
                                                                  >
                                                                        <span
                                                                              style={{
                                                                                    textTransform:
                                                                                          "uppercase",
                                                                              }}
                                                                        >
                                                                              {
                                                                                    payment.method
                                                                              }
                                                                        </span>
                                                                  </Tooltip>
                                                            </TableCell>
                                                            <TableCell>
                                                                  <Box
                                                                        sx={{
                                                                              backgroundColor:
                                                                                    payment.status ===
                                                                                    "captured"
                                                                                          ? "#0071DC20"
                                                                                          : "#FFC22020",
                                                                              color:
                                                                                    payment.status ===
                                                                                    "captured"
                                                                                          ? "#0071DC"
                                                                                          : "#FFC220",
                                                                              py: 0.5,
                                                                              px: 1,
                                                                              borderRadius: 1,
                                                                              display: "inline-block",
                                                                        }}
                                                                  >
                                                                        {
                                                                              payment.status
                                                                        }
                                                                  </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                  ₹
                                                                  {payment.feeInRupees.toFixed(
                                                                        2
                                                                  )}
                                                            </TableCell>
                                                            <TableCell>
                                                                  {
                                                                        payment.contact
                                                                  }
                                                            </TableCell>
                                                            <TableCell>
                                                                  <IconButton
                                                                        onClick={() =>
                                                                              handleViewPDF(
                                                                                    payment.id
                                                                              )
                                                                        }
                                                                        color="primary"
                                                                        size="small"
                                                                  >
                                                                        <Tooltip title="View Bill">
                                                                              <PictureAsPdfIcon />
                                                                        </Tooltip>
                                                                  </IconButton>
                                                            </TableCell>
                                                      </TableRow>
                                                ))}
                                    </TableBody>
                              </Table>
                        </TableContainer>
                        <TablePagination
                              rowsPerPageOptions={[10, 25, 100]}
                              component="div"
                              count={payments.length}
                              rowsPerPage={rowsPerPage}
                              page={page}
                              onPageChange={handleChangePage}
                              onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                  </Paper>
            </Box>
      );
};

export default Revenue;
