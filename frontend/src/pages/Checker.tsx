import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DBTFlow from '../components/DBTFlow'
import axios from 'axios'

type SimpleResult = {
  dbtEnabled: boolean
  bank: string
  account: string
  lastTxn?: string
  remarks?: string
}


export default function Checker() {
  const { t } = useTranslation()
  const [aadhaar, setAadhaar] = useState('')
  const [account, setAccount] = useState('')
  const [mobile, setMobile] = useState('')
  const [otpStep, setOtpStep] = useState(false)
  const [otp, setOtp] = useState('')
  const [sentOtp, setSentOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [result, setResult] = useState<SimpleResult | null>(null)

  const BANKS = ['State Bank of India', 'Punjab National Bank', 'ICICI Bank', 'HDFC Bank', 'Bank of Baroda', 'Axis Bank']

  function mask(acc: string) {
    const trimmed = acc.trim()
    const last4 = trimmed.slice(-4)
    return trimmed.length > 4 ? `**** ${last4}` : trimmed
  }

  

 async function handleCheck(e?: React.FormEvent) {
  e?.preventDefault();
  setResult(null);

  if (!aadhaar.trim() || !account.trim() || !mobile.trim()) {
    alert('Please fill Aadhaar, bank account number, and mobile number to check.');
    return;
  }

  try {
    const res = await axios.post('/api/check', {
      aadhaar,
      account,
      mobile,
    });

    // backend sends otp in demo
    const generatedOtp = res.data.otp;
    setSentOtp(generatedOtp);
    setOtp('');
    setOtpError('');
    setOtpStep(true);
    alert(`Simulated OTP from backend: ${generatedOtp}`);
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.error || 'Error while checking status.');
  }
}

 async function handleOtpVerify(e?: React.FormEvent) {
  e?.preventDefault();

  if (!otp) {
    setOtpError('Please enter OTP.');
    return;
  }

  try {
    const res = await axios.post('/api/verify-otp', {
      aadhaar,
      account,
      mobile,
      otp,
    });

    const r: SimpleResult = res.data;
    setResult(r);
    setOtpStep(false);
    setOtpError('');
  } catch (err: any) {
    console.error(err);
    setOtpError(err.response?.data?.error || 'Error verifying OTP.');
  }
}

  return (
    <div className="container-pad py-10">
      <h1 className="text-2xl font-bold mb-6">DBT & Aadhaar Status Checker</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <div className="max-w-xl space-y-4">
        {/* <div className="rounded-md bg-blue-50 border border-blue-200 p-3 text-sm text-blue-700">
          Your Aadhaar and account details are secure. This is a demo check that shows a basic result based on the inputs you provide.
        </div> */}
        <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800 mt-3">
          <strong>Privacy Notice: </strong>Login credentials are not stored on our platform for security purpose.
        </div>


        {!otpStep ? (
          <form className="space-y-4" onSubmit={handleCheck}>
            <div>
              <label className="block text-sm font-medium mb-1">Aadhaar / UID *</label>
              <input value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} type="text" placeholder="Enter Aadhaar or UID" className="w-full rounded-md border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bank Account Number *</label>
              <input value={account} onChange={(e) => setAccount(e.target.value)} type="text" placeholder="Enter your bank account number" className="w-full rounded-md border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mobile Number *</label>
              <input value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} type="text" maxLength={10} placeholder="Enter your mobile number" className="w-full rounded-md border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="flex-1 rounded-md bg-brand text-white py-2 font-medium">Check Status</button>
              <button type="button" onClick={() => { setAadhaar(''); setAccount(''); setMobile(''); setResult(null) }} className="rounded-md border px-4 py-2">Reset</button>
            </div>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleOtpVerify}>
            <div className="text-center text-slate-700 text-sm mb-2">Enter the 6-digit OTP sent to your mobile number.</div>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter OTP"
              className="w-full rounded-md border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-brand tracking-widest text-center text-lg"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
            />
            {otpError && <div className="text-red-500 text-sm text-center">{otpError}</div>}
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-[#003B73] text-white py-3 px-6 font-bold text-base shadow-lg hover:bg-[#002855] focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-150"
                aria-label="Verify OTP"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2"><path d="M12 2l7 4v5c0 5.25-3.5 10-7 11-3.5-1-7-5.75-7-11V6l7-4z" fill="#1976d2"/><path d="M9.5 12.5l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="leading-none">Verify OTP</span>
              </button>
            </div>
            <div className="flex justify-end">
              <button type="button" className="text-xs text-blue-700 hover:underline mt-1" onClick={handleCheck}>Resend OTP</button>
            </div>
          </form>
        )}

        {result ? (
          <div className="rounded-md border border-slate-200 p-4 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Account Summary</h2>
              <span className={`text-sm font-medium ${result.dbtEnabled ? 'text-green-700' : 'text-red-600'}`}>{result.dbtEnabled ? 'DBT Enabled' : 'Not DBT Enabled'}</span>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
              <div>
                <div className="text-xs text-slate-500">Bank</div>
                <div className="font-medium">{result.bank}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Account</div>
                <div className="font-medium">{result.account}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Last seeding</div>
                <div className="font-medium">{result.lastTxn}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Remarks</div>
                <div className="font-medium">{result.remarks}</div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="rounded-md border border-slate-200 p-4">
          <p className="font-medium mb-2">Need Help?</p>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>For Aadhaar-related queries: Visit UIDAI Portal</li>
            <li>For DBT issues: Call toll-free 1800-XXX-XXXX</li>
            <li>Find nearest center: Center Locator</li>
          </ul>
        </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <DBTFlow />
        </div>
      </div>
    </div>
  )
}