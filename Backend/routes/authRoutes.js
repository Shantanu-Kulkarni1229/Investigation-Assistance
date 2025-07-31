import express from "express";
import { 
  signup, 
  login, 
  verifySignupOTP, 
  verifyLoginOTP, 
  forgotPassword, 
  verifyForgotOTP, 
  resetPassword 
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-signup-otp", verifySignupOTP);
router.post("/verify-login-otp", verifyLoginOTP);
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-otp", verifyForgotOTP);
router.post("/reset-password", resetPassword);

export default router;
