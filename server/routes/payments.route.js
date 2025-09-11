import { Router } from "express";
import {
      getRazorpayApiKey,
      createCheckoutPayment,
      verifyPayment,
      allPayments,
      uploadBill,
      getBill,
} from "../controllers/payments.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/checkoutpay").post(isLoggedIn, createCheckoutPayment);
router.route("/verify").post(isLoggedIn, verifyPayment);
router.route("/razorpay-key").get(isLoggedIn, getRazorpayApiKey);
router.route("/").get(isLoggedIn, allPayments);
router.route("/upload-bill").post(
      isLoggedIn,
      upload.single("billPdf"),
      uploadBill
);

// Route to get bill by payment ID
router.route("/bill/:paymentId").get(isLoggedIn, getBill);

export default router;
