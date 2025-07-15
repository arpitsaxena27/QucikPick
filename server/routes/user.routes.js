import { Router } from "express";
import { registerUser, loginUser, logoutUser, getProfile,forgotPassword,resetPassword } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import  upload  from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/register", upload.single("avatar"), registerUser);//convert binary file to image
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", isLoggedIn, getProfile);//verify the jwt token
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
