import PropTypes from "prop-types";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Box, Paper, Typography, Button, Stack, Divider } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Receipt from "./Receipt";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const PaymentSuccess = () => {
      const location = useLocation();
      const { receiptData, paymentId,amount } = location.state || {};
      return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
                  <Paper
                        elevation={6}
                        className="max-w-xl w-full rounded-2xl p-8 md:p-10"
                        component={Box}
                        role="region"
                        aria-label="payment-success"
                  >
                        <Box className="flex flex-col items-center text-center">
                              <div className="rounded-full bg-green-50 p-4 mb-4 shadow-sm">
                                    <CheckCircleOutlineIcon
                                          sx={{
                                                fontSize: 56,
                                                color: "#16a34a",
                                          }}
                                          aria-hidden
                                    />
                              </div>

                              <Typography
                                    variant="h5"
                                    component="h1"
                                    className="font-semibold"
                              >
                                    Payment Successful
                              </Typography>

                              <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    className="mt-2 mb-4 max-w-[36rem]"
                              >
                                    Thank you — your payment has been processed
                                    successfully. We&apos;ve sent a confirmation to
                                    your registered email.
                              </Typography>

                              <Box className="w-full mt-4 mb-6">
                                    <Divider />
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-4">
                                          <div className="text-left">
                                                {paymentId && (
                                                      <Typography variant="subtitle2">
                                                            Order ID
                                                      </Typography>
                                                )}
                                                {paymentId && (
                                                      <Typography
                                                            variant="body1"
                                                            className="font-medium"
                                                      >
                                                            {paymentId}
                                                      </Typography>
                                                )}
                                          </div>

                                          <div className="text-left md:text-right">
                                                {amount && (
                                                      <Typography variant="subtitle2">
                                                            Amount Paid
                                                      </Typography>
                                                )}
                                                {amount && (
                                                      <Typography
                                                            variant="body1"
                                                            className="font-medium"
                                                      >
                                                            {typeof amount ===
                                                            "number"
                                                                  ? `₹${amount}`
                                                                  : amount}
                                                      </Typography>
                                                )}
                                          </div>
                                    </div>
                              </Box>

                              <Stack spacing={2} className="w-full mt-2">
                                    <Button
                                          component={RouterLink}
                                          to="/MartInfo"
                                          variant="contained"
                                          size="large"
                                          fullWidth
                                          disableElevation
                                    >
                                          Return to Home
                                    </Button>

                                    {receiptData && (
                                          <PDFDownloadLink
                                                document={
                                                      <Receipt
                                                            orderData={
                                                                  receiptData
                                                            }
                                                      />
                                                }
                                                fileName={`receipt-${paymentId}.pdf`}
                                          >
                                                {({ loading }) => (
                                                      <Button
                                                            variant="text"
                                                            size="small"
                                                            className="justify-center"
                                                            startIcon={
                                                                  <FileDownloadIcon />
                                                            }
                                                            disabled={loading}
                                                      >
                                                            {loading
                                                                  ? "Generating Receipt..."
                                                                  : "Download Receipt"}
                                                      </Button>
                                                )}
                                          </PDFDownloadLink>
                                    )}
                              </Stack>

                              <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    className="mt-6"
                              >
                                    If you have questions about this payment,
                                    please contact our support at
                                    support@gmail.com.
                              </Typography>
                        </Box>
                  </Paper>
            </div>
      );
};

PaymentSuccess.propTypes = {
      orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

PaymentSuccess.defaultProps = {
      orderId: null,
      amount: null,
};

export default PaymentSuccess;
