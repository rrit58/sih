import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar({ onLogout }) {
  const { t } = useTranslation();

  return (
    <nav className="bg-white shadow flex items-center justify-between px-6 py-3">
      <div className="text-xl font-bold text-blue-900">DBT Portal Dashboard</div>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <button onClick={onLogout} className="px-4 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 font-medium">
          {t('logout')}
        </button>
      </div>
    </nav>
  );
}
