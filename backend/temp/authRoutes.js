import express from "express";
import {
  loginUser,
  verifyLoginOtp,
  requestPasswordReset,
  verifyResetOtp
} from "../temp/authControllers.js";

const router = express.Router();

router.post("/login", loginUser);              // email + password
router.post("/verify-login-otp", verifyLoginOtp);

router.post("/request-password-reset", requestPasswordReset); // email only
router.post("/verify-reset-otp", verifyResetOtp);             // otp + new password

export default router;

