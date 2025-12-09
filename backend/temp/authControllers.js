import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

let otpStore = {}; // TEMP in-memory OTP storage



// -------------------------------------------------------------
// LOGIN WITH EMAIL + PASSWORD
// -------------------------------------------------------------
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Login.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    // PASSWORD CORRECT → OTP LOGIN
    if (isMatch) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      otpStore[email] = {
        otp,
        expiry: Date.now() + 5 * 60 * 1000,
        mode: "login"
      };

      console.log("Login OTP:", otp);

      return res.json({
        success: true,
        otpSent: true,
        message: "OTP sent for login"
      });
    }

    // PASSWORD WRONG
    return res.json({
      success: false,
      message: "Incorrect password. Please use reset password option."
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};



// -------------------------------------------------------------
// VERIFY LOGIN OTP → Dashboard redirect
// -------------------------------------------------------------
export const verifyLoginOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const data = otpStore[email];

    if (!data || data.otp !== otp || data.expiry < Date.now()) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    if (data.mode !== "login") {
      return res.json({ success: false, message: "Not a login OTP" });
    }

    delete otpStore[email];

    const user = await Login.findOne({ email });

    const token = jwt.sign(
      { email: user.email, category: user.category },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      category: user.category,
      dashboardName:
        user.category === "NGO"                                           //////////////////////////
          ? user.organizationName
          : user.gramPanchayatName
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};



// -------------------------------------------------------------
// REQUEST PASSWORD RESET (Wrong password or Forgot Password)
// -------------------------------------------------------------
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Login.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Email does not exist" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expiry: Date.now() + 5 * 60 * 1000,
      mode: "reset"
    };

    console.log("Reset OTP:", otp);

    return res.json({
      success: true,
      otpSent: true,
      message: "OTP sent to reset password"
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};



// -------------------------------------------------------------
// VERIFY RESET OTP + SET NEW PASSWORD
// -------------------------------------------------------------
export const verifyResetOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const data = otpStore[email];

    if (!data || data.otp !== otp || data.expiry < Date.now()) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    if (data.mode !== "reset") {
      return res.json({ success: false, message: "Not a reset OTP" });
    }

    const user = await Login.findOne({ email });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    await user.save();
    delete otpStore[email];

    return res.json({
      success: true,
      message: "Password reset successfully. You can now login."
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
