import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const loginOptions = [
  {
    label: 'NGO Login',
    route: '/login',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#003B73" strokeWidth="2"/><path d="M12 12a5 5 0 100-10 5 5 0 000 10zM4 20a8 8 0 0116 0" stroke="#003B73" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    category: 'NGO',
  },
  {
    label: 'Gram Panchayat Login',
    route: '/login',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M3 11l9-6 9 6v7a1 1 0 01-1 1h-4v-5H8v5H4a1 1 0 01-1-1v-7z" stroke="#003B73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    category: 'Panchayat',
  },
  {
    label: 'School Login',
    route: '/login',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 2l8 4-8 4-8-4 8-4zM4 10v8a2 2 0 002 2h12a2 2 0 002-2v-8" stroke="#003B73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    category: 'School',
  },
];

export default function LoginSelection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogin = (category) => {
    navigate('/login', { state: { category } });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Select Login Type</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        {loginOptions.map((opt) => (
          <div
            key={opt.label}
            className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center"
          >
            <div className="mb-4">{opt.icon}</div>
            <div className="text-lg font-semibold text-slate-800 mb-2">{opt.label}</div>
            <button
              className="mt-4 px-6 py-2 bg-[#003B73] hover:bg-[#003366] text-white rounded-lg font-medium transition-colors"
              onClick={() => handleLogin(opt.category)}
            >
              Login
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
