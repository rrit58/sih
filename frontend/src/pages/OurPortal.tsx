import React from 'react'
import { useTranslation } from 'react-i18next'
import PortalCard from '../components/PortalCard'

export default function OurPortal() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="container-pad py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{t('ourPortalsTitle')}</h1>
          <p className="mt-3 text-slate-700">{t('ourPortalsDesc')}</p>
        </div>
      </header>

      <main className="container-pad py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <PortalCard
              title={t('panchayatLoginTitle')}
              desc="Registration portal for Gram Panchayat officials and local awareness coordinators."
              to="/panchayat"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11l9-6 9 6v7a1 1 0 01-1 1h-4v-5H8v5H4a1 1 0 01-1-1v-7z" stroke="#003B75" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            />

            <PortalCard
              title={t('ngoLoginTitle')}
              desc="For NGOs and volunteers who want to support DBT & scholarship awareness."
              to="/ngo"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zM4 20a8 8 0 0116 0" stroke="#003B75" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            />

            <PortalCard
              title={t('schoolLoginTitle')}
              desc="For schools, teachers, and PTA members conducting awareness sessions."
              to="/pta"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l8 4-8 4-8-4 8-4zM4 10v8a2 2 0 002 2h12a2 2 0 002-2v-8" stroke="#003B75" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            />
          </div>
        </div>
      </main>

      {/* Login Link at the bottom */}
      <footer className="mt-16 mb-8 flex justify-center">
        <a
          href="/login"
          className="text-slate-600 text-base hover:text-blue-600 transition-colors font-medium"
        >
          {t('alreadyRegistered')} {t('login')}
        </a>
      </footer>
    </div>
  )
}
