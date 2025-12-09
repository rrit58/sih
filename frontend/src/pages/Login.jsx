import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const categories = [
  { label: 'NGO', value: 'NGO' },
  { label: 'School / PTA', value: 'SCHOOL_PTA' },
  { label: 'Gram Panchayat', value: 'GRAM_PANCHAYAT' },
];

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Login() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const initialCategory = location.state?.category || 'NGO';
  const [category, setCategory] = useState(initialCategory);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userType: category,
          email: email.toLowerCase(),
          password,
        }),
      });

      const resp = await response.json();

      if (!response.ok) {
        setError(resp.error || resp.message || 'Login failed. Please check your credentials.');
        return;
      }

      // Backend returns { message, data: { _id, email, registrationType, name } }
      const payload = resp.data || {};
      if (payload.email) localStorage.setItem('userEmail', payload.email);
      if (payload.name) localStorage.setItem('userName', payload.name);

      setSuccessMessage('Login successful! Redirecting...');

      // Redirect after 1.5 seconds
      setTimeout(() => {
        let dashboardName = '';
        if (category === 'NGO') dashboardName = 'Durga NGO';
        if (category === 'School') dashboardName = 'SDVS School';
        if (category === 'Panchayat') dashboardName = 'Rampur Gram Panchayat';
        navigate('/dashboard', { state: { category, dashboardName } });
      }, 1500);
    } catch (err) {
      setError('Unable to connect to server. Please try again later.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">Welcome Back</h2>
        <p className="text-center text-slate-600 mb-6 text-sm">Sign in to your account</p>

        <div className="flex justify-center mb-6 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`px-4 py-2 rounded-full font-medium transition-colors text-sm ${
                category === cat.value
                  ? 'bg-[#003B73] text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              onClick={() => setCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}    
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/reset-password')}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 px-6 py-2.5 rounded-lg font-semibold text-white transition-all ${
              loading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-[#003B73] hover:bg-[#003366] active:scale-95'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Registration removed: only login available */}
      </div>
    </div>
  );
}
