import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * @desc Signup - Create new user and send OTP
 * @route POST /api/auth/signup
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 min expiry
    });

    // Send OTP via email
    await sendEmail(email, "Email Verification OTP", `Your OTP is: ${otp}`);

    res.status(201).json({
      success: true,
      message: "Signup successful. OTP sent to email for verification.",
      userId: user._id,
    });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

/**
 * @desc Verify OTP
 * @route POST /api/auth/verify-otp
 */
/**
 * @desc Verify Signup OTP
 * @route POST /api/auth/verify-signup-otp
 */
export const verifySignupOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Signup verification successful. You can now log in.",
    });
  } catch (error) {
    console.error("❌ Signup OTP Verification Error:", error);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
};

/**
 * @desc Verify Login OTP and return JWT
 * @route POST /api/auth/verify-login-otp
 */
export const verifyLoginOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP after successful login
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("❌ Login OTP Verification Error:", error);
    res.status(500).json({ message: "Server error during login OTP verification" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    // Send OTP email
    await sendEmail(user.email, "Login Verification OTP", `Your OTP is: ${otp}`);

    res.status(200).json({
      success: true,
      message: "Login successful. OTP sent to your email for verification.",
      userId: user._id,
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};


/**
 * @desc Forgot Password - Send OTP
 * @route POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    await sendEmail(user.email, "Password Reset OTP", `Your OTP is: ${otp}`);

    res.status(200).json({
      success: true,
      message: "OTP sent to email for password reset",
      userId: user._id,
    });
  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    res.status(500).json({ message: "Server error during forgot password" });
  }
};

/**
 * @desc Verify Forgot Password OTP
 * @route POST /api/auth/verify-forgot-otp
 */
export const verifyForgotOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified. You can now reset your password.",
    });
  } catch (error) {
    console.error("❌ Verify Forgot OTP Error:", error);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
};

/**
 * @desc Reset Password
 * @route POST /api/auth/reset-password
 */
export const resetPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    res.status(500).json({ message: "Server error during password reset" });
  }
};
