import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

// Example route: http://localhost:5000/api/users/status
// router.get('/status', (req, res) => {
//   res.json({ ok: true, message: 'User service is running' })
// })



const accountSchema = new mongoose.Schema({
  aadhaar: { type: String, required: true },
  account: { type: String, required: true },
  mobile: { type: String, required: true },
  dbtEnabled: { type: Boolean, required: true },
  bank: { type: String, required: true },
  lastTxn: { type: String },
  remarks: { type: String },
});

const Account = mongoose.model('Checker', accountSchema);

// === 3. SIMPLE IN-MEMORY OTP STORE (FOR DEMO ONLY) ===
const otpStore = new Map(); // key: aadhaar+account+mobile, value: otp string

function makeKey(aadhaar, account, mobile) {
  return `${aadhaar}|${account}|${mobile}`;
}

// === 4. ROUTE: /api/check  (called by "Check Status" button) ===
// - verifies that given combination exists in DB
// - generates OTP and stores in otpStore
router.post('/check', async (req, res) => {
  try {
    const { aadhaar, account, mobile } = req.body;

    if (!aadhaar || !account || !mobile) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // normalize
    const cleanAadhaar = aadhaar.replace(/\D/g, '');
    const cleanAccount = account.replace(/\s/g, '');
    const cleanMobile = mobile.replace(/\D/g, '');

    const acc = await Account.findOne({
      aadhaar: cleanAadhaar,
      account: cleanAccount,
      mobile: cleanMobile,
    });

    if (!acc) {
      return res.status(404).json({ error: 'No record found for given details.' });
    }

    // generate demo OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = makeKey(cleanAadhaar, cleanAccount, cleanMobile);
    otpStore.set(key, otp);

    // In real app you would send SMS and NOT send otp back.
    return res.json({
      message: 'OTP generated successfully.',
      otp,            // for demo so you can show it in alert
    });
  } catch (err) {
    console.error('Error in /api/check:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// === 5. ROUTE: /api/verify-otp  (called by "Verify OTP" button) ===
// - checks OTP from otpStore
// - if correct, returns account status from DB
router.post('/verify-otp', async (req, res) => {
  try {
    const { aadhaar, account, mobile, otp } = req.body;

    if (!aadhaar || !account || !mobile || !otp) {
      return res.status(400).json({ error: 'All fields including OTP are required.' });
    }

    const cleanAadhaar = aadhaar.replace(/\D/g, '');
    const cleanAccount = account.replace(/\s/g, '');
    const cleanMobile = mobile.replace(/\D/g, '');

    const key = makeKey(cleanAadhaar, cleanAccount, cleanMobile);
    const storedOtp = otpStore.get(key);

    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    // OTP valid, delete it
    otpStore.delete(key);

    // fetch account info
    const acc = await Account.findOne({
      aadhaar: cleanAadhaar,
      account: cleanAccount,
      mobile: cleanMobile,
    });

    if (!acc) {
      return res.status(404).json({ error: 'Account not found.' });
    }

    // send only required fields to frontend
    return res.json({
      dbtEnabled: acc.dbtEnabled,
      bank: acc.bank,
      account: acc.account,
      lastTxn: acc.lastTxn,
      remarks: acc.remarks,
    });
  } catch (err) {
    console.error('Error in /api/verify-otp:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;