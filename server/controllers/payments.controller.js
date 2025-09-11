import crypto from "crypto";
import { User } from "../models/user.model.js";
import AppError from "../utils/appError.js";
import { razorpay } from "../server.js";
import Payment from "../models/Payment.model.js";
import cloudinary from "cloudinary";
import fs from "fs";

export const createCheckoutPayment = async (req, res, next) => {
      try {
            // Extracting ID from request obj and amount from request body
            const { id } = req.user;
            const { amount, currency = "INR" } = req.body;

            if (!amount) {
                  return next(new AppError("Amount is required", 400));
            }

            // Finding the user based on the ID
            const user = await User.findById(id);

            if (!user) {
                  return next(new AppError("Unauthorized, please login"));
            }

            // Creating a payment order using razorpay
            const options = {
                  amount: amount * 100, // Razorpay expects amount in smallest currency unit (paise for INR)
                  currency,
                  receipt: `receipt_${Date.now()}`,
                  notes: {
                        userId: id,
                  },
            };

            const order = await razorpay.orders.create(options);

            res.status(200).json({
                  success: true,
                  message: "Order created successfully",
                  order,
            });
      } catch (error) {
            next(error);
      }
};

export const verifyPayment = async (req, res, next) => {
      try {
            const {
                  razorpay_payment_id,
                  razorpay_order_id,
                  razorpay_signature,
            } = req.body;

            if (
                  !razorpay_payment_id ||
                  !razorpay_order_id ||
                  !razorpay_signature
            ) {
                  return next(new AppError("All fields are required", 400));
            }

            // Generating a signature with SHA256 for verification purposes
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const generatedSignature = crypto
                  .createHmac("sha256", process.env.RAZORPAY_SECRET)
                  .update(body)
                  .digest("hex");

            // Check if generated signature and signature received from the frontend is the same or not
            if (generatedSignature !== razorpay_signature) {
                  return next(
                        new AppError(
                              "Payment not verified, please try again.",
                              400
                        )
                  );
            }

            // Get martId from request body
            const { martId } = req.body;

            if (!martId) {
                  return next(new AppError("Mart ID is required", 400));
            }

            // Find or create payment document for this mart
            let paymentDoc = await Payment.findOne({ martId });

            if (!paymentDoc) {
                  paymentDoc = await Payment.create({
                        martId,
                        retailerId: martId, // Using martId as retailerId since they're the same
                        payments: [],
                  });
            }

            // Add the new payment to the payments array
            paymentDoc.payments.push({
                  razorpay_payment_id,
                  razorpay_order_id,
                  razorpay_signature,
                  amount: req.body.amount,
            });

            await paymentDoc.save();

            res.status(200).json({
                  success: true,
                  message: "Payment verified successfully",
            });
      } catch (error) {
            next(error);
      }
};

export const getRazorpayApiKey = async (_req, res, next) => {
      try {
            res.status(200).json({
                  success: true,
                  message: "Razorpay API key",
                  key: process.env.RAZORPAY_KEY_ID,
            });
      } catch (error) {
            next(error);
      }
};

export const uploadBill = async (req, res, next) => {
      try {
            if (!req.file) {
                  return next(new AppError("No bill PDF provided", 400));
            }

            const { paymentId } = req.body;
            if (!paymentId) {
                  return next(new AppError("Payment ID is required", 400));
            }

            // Find the payment document containing this payment
            const paymentDoc = await Payment.findOne({
                  "payments.razorpay_payment_id": paymentId,
            });

            if (!paymentDoc) {
                  return next(new AppError("Payment not found", 404));
            }

            // Find the specific payment in the payments array
            const payment = paymentDoc.payments.find(
                  (p) => p.razorpay_payment_id === paymentId
            );
            if (!payment) {
                  return next(new AppError("Payment not found", 404));
            }

            // Upload to Cloudinary
            const cloudinaryResponse = await cloudinary.v2.uploader.upload(
                  req.file.path,
                  {
                        folder: "bills",
                        resource_type: "raw",
                  }
            );

            // Delete the file from local uploads folder
            fs.unlinkSync(req.file.path);

            // Update the payment with Cloudinary details
            payment.billPdf = {
                  secure_url: cloudinaryResponse.secure_url,
                  public_id: cloudinaryResponse.public_id,
            };
            await paymentDoc.save();

            res.status(200).json({
                  success: true,
                  message: "Bill uploaded to Cloudinary successfully",
                  billUrl: cloudinaryResponse.secure_url,
            });
      } catch (error) {
            // If there's an error, make sure to delete the uploaded file
            if (req.file) {
                  fs.unlinkSync(req.file.path);
            }
            next(error);
      }
};

export const getBill = async (req, res, next) => {
      try {
            const { paymentId } = req.params;

            if (!paymentId) {
                  return next(new AppError("Payment ID is required", 400));
            }

            // Find the payment document containing this payment
            const paymentDoc = await Payment.findOne({
                  "payments.razorpay_payment_id": paymentId,
            });

            if (!paymentDoc) {
                  return next(new AppError("Payment not found", 404));
            }

            // Find the specific payment in the payments array
            const payment = paymentDoc.payments.find(
                  (p) => p.razorpay_payment_id === paymentId
            );

            if (!payment) {
                  return next(new AppError("Payment not found", 404));
            }

            if (!payment.billPdf || !payment.billPdf.secure_url) {
                  return next(
                        new AppError("No bill found for this payment", 404)
                  );
            }

            res.status(200).json({
                  success: true,
                  billPdf: payment.billPdf,
            });
      } catch (error) {
            next(error);
      }
};

export const allPayments = async (req, res, next) => {
      try {
            const { count = 10, skip = 0, from, to } = req.query;

            // Prepare date range for filtering
            const dateFilter = {};
            if (from) {
                  dateFilter["created_at[gte]"] = Math.floor(
                        new Date(from).getTime() / 1000
                  );
            }
            if (to) {
                  dateFilter["created_at[lte]"] = Math.floor(
                        new Date(to).getTime() / 1000
                  );
            }

            // Find all payments from razorpay
            const allPayments = await razorpay.payments.all({
                  count: parseInt(count),
                  skip: parseInt(skip),
                  ...dateFilter,
            });

            const monthNames = [
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
            ];

            const finalMonths = monthNames.reduce((acc, month) => {
                  acc[month] = { count: 0, amount: 0 };
                  return acc;
            }, {});

            // Process payments data
            allPayments.items.forEach((payment) => {
                  if (payment.status === "captured") {
                        const paymentDate = new Date(payment.created_at * 1000);
                        const month = monthNames[paymentDate.getMonth()];
                        finalMonths[month].count += 1;
                        finalMonths[month].amount += payment.amount / 100; // Convert from paise to rupees
                  }
            });

            // Prepare monthly records
            const monthlySalesCount = monthNames.map(
                  (month) => finalMonths[month].count
            );
            const monthlySalesAmount = monthNames.map(
                  (month) => finalMonths[month].amount
            );

            res.status(200).json({
                  success: true,
                  message: "All payments retrieved successfully",
                  allPayments: allPayments.items,
                  analytics: {
                        monthWise: finalMonths,
                        monthlySalesCount,
                        monthlySalesAmount,
                  },
                  totalCount: allPayments.count,
            });
      } catch (error) {
            next(error);
      }
};
