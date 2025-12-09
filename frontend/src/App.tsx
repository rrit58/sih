import React, { useState } from 'react'
import { Link, NavLink, Route, Routes } from 'react-router-dom'
import Chatbot from './components/Chatbot'
import Resources from './pages/Resources'
import Scholarships from './pages/Scholarships'
import Home from './pages/Home'
import PTA from './pages/PTA'
import NearestCenters from './pages/NearestCenters'
import NGOPortal from './pages/NGOPortal'
import GramPanchayat from './pages/GramPanchayat'
import OurPortal from './pages/OurPortal'
import Checker from './pages/Checker'
import LoginSelection from './pages/LoginSelection'
import Login from './pages/Login'
import Registration from './pages/Registration'
import ResetPassword from './pages/ResetPassword'
import SetNewPassword from './pages/SetNewPassword'
import Dashboard from './pages/Dashboard'
import CommonDashboard from './pages/CommonDashboard'
import LanguageSwitcher from './components/LanguageSwitcher'
// Awareness page removed from nav; use Nearest Centers instead

function Header() {
  const [open, setOpen] = useState(false)

  const labels = ['Home', 'Checker', 'Nearest Centers', 'Scholarships', 'Resources', 'Our Portal']
  const paths = ['/', '/checker', '/centers', '/scholarships', '/resources', '/our-portal']

  return (
    <header className="bg-white shadow-soft">
      <div className="container-pad flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3">
            <img
              src="/public/Screenshot_2025-11-24_031543-removebg-preview.png"
              alt="DBT Connect logo"
              onError={(e) => { const img = e.target as HTMLImageElement; img.onerror = null; img.src = '/logo.svg' }}
              className="h-7 md:h-10 lg:h-14 xl:h-16 w-auto object-contain"
            />
          <div className="leading-tight">
            <p className="text-base md:text-lg lg:text-xl font-semibold">DBT Connect</p>
            <p className="text-[11px] md:text-[12px] text-gray-500">Ministry of Social Justice and Empowerment</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {labels.map((label, i) => (
            <NavLink
              key={paths[i]}
              to={paths[i]}
              className={({ isActive }) =>
                `text-sm ${isActive ? 'text-brand font-medium' : 'text-gray-700 hover:text-brand'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <div className="md:hidden flex items-center">
          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((s) => !s)}
            className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-gray-200"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${open ? 'block' : 'hidden'} md:hidden border-t border-slate-200 bg-white`}> 
        <div className="container-pad py-4 flex flex-col gap-2">
          {labels.map((label, i) => (
            <NavLink
              key={paths[i]}
              to={paths[i]}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `block py-2 rounded-md px-2 ${isActive ? 'bg-slate-100 text-brand font-medium' : 'text-gray-700 hover:bg-slate-50'}`}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 mt-16">
      <div className="container-pad py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <p className="font-semibold mb-2">About DBT Connect</p>
          <p className="text-sm text-slate-300">DBT Connect is a unified portal for Direct Benefit Transfer services, scholarship information, and citizen support.</p>
        </div>
        <div>
          <p className="font-semibold mb-2">Quick Links</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/checker" className="hover:text-white">DBT Status Checker</Link></li>
            <li><Link to="/scholarships" className="hover:text-white">Scholarships</Link></li>
            <li><Link to="/resources" className="hover:text-white">Awareness Resources</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-2">Contact Us</p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>1800-XXX-XXXX (Toll Free)</li>
            <li>support@dbtconnect.gov.in</li>
            <li>Ministry Building, New Delhi - 110001</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-2">Legal</p>
          <ul className="space-y-2 text-sm">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Accessibility Statement</li>
            <li>RTI</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800"/>
      <div className="container-pad py-6 text-center text-xs text-slate-400">© 2025 DBT Connect - Government of India. All rights reserved.</div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checker" element={<Checker />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/centers" element={<NearestCenters />} />
          <Route path="/ngo" element={<NGOPortal />} />
          <Route path="/panchayat" element={<GramPanchayat />} />
          <Route path="/pta" element={<PTA />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/new" element={<SetNewPassword />} />
          <Route path="/our-portal" element={<OurPortal />} />
          {/* removed /awareness route; Nearest Centers is available at /centers */}
          <Route path="/login-selection" element={<LoginSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/dashboard" element={<CommonDashboard />} />
          {/* Legacy dashboard for compatibility, can be removed later */}
          <Route path="/dashboard-legacy" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}