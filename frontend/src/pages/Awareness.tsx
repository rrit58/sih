import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import VideoTutorials from '../components/VideoTutorials'

const ANIMATIONS = [
  { id: 'a1', title: 'Aadhaar Linking Steps', src: '/sih2025/frontend/public/1765031171869_1765031171875.mp4' },
  { id: 'a2', title: 'DBT vs Aadhaar-Link Difference', src: '/sih2025/frontend/public/VN20251206_200049.mp4' },
  { id: 'a3', title: 'Scholarship Eligibility Animation', src: '/sih2025/frontend/public/VN20251207_203541.mp4' },
  { id: 'a4', title: 'Document Preparation Guide', src: '/sih2025/frontend/public/1765031171869_1765031171875.mp4' },
]

const INFOGRAPHICS = [
  { id: 'p1', title: 'DBT Seeding Flowchart', size: 'A3' },
  { id: 'p2', title: 'Scholarship Eligibility Chart', size: 'A4' },
  { id: 'p3', title: 'Common Mistakes Students Make', size: 'A4' },
  { id: 'p4', title: 'Rural Awareness Posters', size: 'A2' },
  { id: 'p5', title: 'Bank Visit Checklist', size: 'A4' },
]

const PDF_GUIDES = [
  { id: 'd1', title: 'DBT Seeding Process – Complete Guide', size: '2.1 MB', downloads: 1245 },
  { id: 'd2', title: 'How to Activate DBT at Bank', size: '1.4 MB', downloads: 842 },
  { id: 'd3', title: 'Scholarship Required Documents', size: '900 KB', downloads: 1983 },
  { id: 'd4', title: 'Aadhaar Seeding FAQs', size: '700 KB', downloads: 623 },
  { id: 'd5', title: 'NPCI Mapping Troubleshooting', size: '1.1 MB', downloads: 412 },
]

const LANGUAGES = ['Hindi', 'English', 'Bengali', 'Marathi', 'Tamil', 'Telugu', 'Odia']

export default function Awareness() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<string>('Downloadable Resources')

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">Awareness Resources</h1>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Verified and easy-to-understand learning materials for students and communities
          </p>
        </header>

        {/* Category Tabs */}
        <nav aria-label="Top level categories" className="mb-10">
          <div className="flex flex-wrap gap-3">
            {[
              'Downloadable Resources',
              'Videos',
              'Animations',
              'Infographics & Posters',
              'PDF Guides',
              'Language Packs',
              'Schools & NGOs',
            ].map((label) => {
              const selected = label === activeTab
              return (
                <button
                  key={label}
                  onClick={() => setActiveTab(label)}
                  className={`px-4 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-300 transition-shadow ${
                    selected
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                  aria-pressed={selected}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Content sections - show all but anchor based on tab for quick navigation */}
        <VideoTutorials />

        <section aria-labelledby="animations" className="mb-12" id="animations">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Animated Explainers</h2>
          <p className="text-slate-600 mb-4">Short colorful animations that explain concepts simply for local communities.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ANIMATIONS.map((a) => (
              <div key={a.id} className="bg-white rounded-lg p-4 shadow-sm flex flex-col">
                <div className="h-36 rounded-md bg-gradient-to-r from-rose-200 via-amber-200 to-emerald-200 mb-3 overflow-hidden flex items-center justify-center">
                  {a.src ? (
                    <video
                      src={a.src}
                      className="w-full h-full object-contain object-center bg-transparent"
                      controls
                      preload="metadata"
                      aria-label={`${a.title} preview`}
                    />
                  ) : (
                    <span className="text-white/90 font-semibold">Animation Preview</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-900">{a.title}</h3>
                  <p className="text-xs text-slate-600 mt-2">Format: Animation</p>
                </div>
                <div className="mt-4">
                  <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-sky-600 text-white rounded-md shadow-sm hover:bg-sky-700">Watch</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="infographics" className="mb-12" id="infographics">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Printable Posters & Infographics</h2>
          <p className="text-slate-600 mb-4">High-visibility posters and printable charts for community noticeboards.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {INFOGRAPHICS.map((p) => (
              <div key={p.id} className="bg-white rounded-lg p-3 shadow-sm flex flex-col">
                <div className="h-40 rounded-md bg-slate-100 mb-3 flex items-center justify-center text-slate-500">Poster Preview</div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-900">{p.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">Type: {p.size.includes('A') ? 'Poster' : 'Infographic'}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{p.size}</span>
                  <a
                    href={`/awareness/${p.id}.pdf`}
                    download
                    aria-label={`Download ${p.title} PDF`}
                    className="text-sm px-3 py-1 bg-white border rounded-md text-sky-600 hover:bg-sky-50"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="guides" className="mb-12" id="guides">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Guides & Documents (PDF)</h2>
          <p className="text-slate-600 mb-4">Step-by-step printable guides for administrators, teachers, and parents.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {PDF_GUIDES.map((d) => (
              <div key={d.id} className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-slate-100 flex items-center justify-center text-slate-600">PDF</div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-900">{d.title}</h3>
                  <p className="text-xs text-slate-500">{d.size} • {d.downloads.toLocaleString()} downloads</p>
                </div>
                <div>
                  <a
                    href={`/awareness/${d.id}.pdf`}
                    download
                    aria-label={`Download ${d.title} PDF`}
                    className="px-3 py-1 bg-sky-600 text-white rounded-md inline-block"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="languages" className="mb-12" id="languages">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Resources in Local Languages</h2>
          <p className="text-slate-600 mb-4">Download awareness kits translated into regional languages.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {LANGUAGES.map((lang) => (
              <div key={lang} className="bg-white rounded-lg p-3 shadow-sm text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-semibold">{lang[0]}</div>
                <div className="mt-2">
                  <div className="text-sm font-medium text-slate-900">{lang}</div>
                  <a
                    href={`/awareness/lang-${lang.toLowerCase()}.zip`}
                    download
                    aria-label={`Download ${lang} awareness kit`}
                    className="mt-2 text-xs px-2 py-1 bg-white border rounded-md text-sky-600 inline-block"
                  >
                    Download Kit
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="community-engagement" className="mb-12" id="community-engagement">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Community Engagement</h2>
          <p className="text-slate-700 mb-6 max-w-3xl">Explore verified resources and campaign materials for Gram Panchayats, NGOs & Volunteers, and School/PTA Sessions. Use these for outreach, awareness drives, and educational sessions. All resources are officially verified and tailored for community impact.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gram Panchayat Column */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5 flex flex-col">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg font-bold text-blue-900">Gram Panchayat</span>
                <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold flex items-center gap-1"><svg className="inline-block" width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#2563eb"/><path d="M17 9l-5.2 5.2-2.8-2.8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Verified</span>
              </div>
              <p className="text-slate-600 mb-4 text-sm">Materials for Sarpanch, Panchayat Secretaries, and field workers to run DBT and scholarship awareness campaigns at the village level.</p>
              <div className="flex-1 flex flex-col gap-4">
                {/* Resource Cards */}
                {[
                  { title: 'Village DBT Drive Kit', location: 'Rampur, UP', stats: '1,200+ reached', badge: true, action: 'Campaign Info' },
                  { title: 'Panchayat Meeting Slides', location: 'Bihar', stats: '8 sessions', badge: true, action: 'View Details' },
                  { title: 'Door-to-Door Checklist', location: 'Maharashtra', stats: '500+ homes', badge: false, action: 'Download' },
                  { title: 'Awareness Poster Set', location: 'Pan India', stats: 'Official', badge: true, action: 'Download' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-blue-50 rounded-xl shadow-sm border border-blue-100 p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-900">{item.title}</span>
                      {item.badge && <span className="ml-1 px-2 py-0.5 bg-blue-200 text-blue-800 text-xs rounded-full font-semibold flex items-center gap-1"><svg className="inline-block" width="12" height="12" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#2563eb"/><path d="M17 9l-5.2 5.2-2.8-2.8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Verified</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1"><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#2563eb"/></svg>{item.location}</span>
                      <span className="inline-flex items-center gap-1"><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1118 0 9 9 0 01-18 0zm9-4a1 1 0 100 2 1 1 0 000-2zm1 8h-2v-2h2v2z" fill="#64748b"/></svg>{item.stats}</span>
                    </div>
                    <button className="mt-2 px-3 py-1.5 bg-blue-700 text-white rounded-md shadow hover:bg-blue-800 text-xs font-medium w-max">{item.action}</button>
                  </div>
                ))}
              </div>
            </div>

            {/* NGOs & Volunteers Column */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5 flex flex-col">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg font-bold text-blue-900">NGOs & Volunteers</span>
                <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold flex items-center gap-1"><svg className="inline-block" width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#2563eb"/><path d="M17 9l-5.2 5.2-2.8-2.8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Verified</span>
              </div>
              <p className="text-slate-600 mb-4 text-sm">Resources for NGOs, SHGs, and volunteers to conduct awareness sessions, distribute materials, and track campaign impact in their communities.</p>
              <div className="flex-1 flex flex-col gap-4">
                {[
                  { title: 'Volunteer Training Deck', location: 'Jharkhand', stats: '5 batches', badge: true, action: 'View Details' },
                  { title: 'NGO Campaign Report', location: 'Odisha', stats: '2,300+ reached', badge: true, action: 'Campaign Info' },
                  { title: 'Session Feedback Form', location: 'West Bengal', stats: '120 responses', badge: false, action: 'Download' },
                  { title: 'Awareness Video Pack', location: 'Pan India', stats: 'Official', badge: true, action: 'Watch Session' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-blue-50 rounded-xl shadow-sm border border-blue-100 p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-900">{item.title}</span>
                      {item.badge && <span className="ml-1 px-2 py-0.5 bg-blue-200 text-blue-800 text-xs rounded-full font-semibold flex items-center gap-1"><svg className="inline-block" width="12" height="12" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#2563eb"/><path d="M17 9l-5.2 5.2-2.8-2.8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Verified</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1"><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#2563eb"/></svg>{item.location}</span>
                      <span className="inline-flex items-center gap-1"><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1118 0 9 9 0 01-18 0zm9-4a1 1 0 100 2 1 1 0 000-2zm1 8h-2v-2h2v2z" fill="#64748b"/></svg>{item.stats}</span>
                    </div>
                    <button className="mt-2 px-3 py-1.5 bg-blue-700 text-white rounded-md shadow hover:bg-blue-800 text-xs font-medium w-max">{item.action}</button>
                  </div>
                ))}
              </div>
            </div>

            {/* School/PTA Sessions Column */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5 flex flex-col">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg font-bold text-blue-900">School/PTA Sessions</span>
                <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold flex items-center gap-1"><svg className="inline-block" width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#2563eb"/><path d="M17 9l-5.2 5.2-2.8-2.8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Verified</span>
              </div>
              <p className="text-slate-600 mb-4 text-sm">Curated for teachers, principals, and PTA members to conduct classroom and parent sessions on DBT, scholarships, and Aadhaar linking.</p>
              <div className="flex-1 flex flex-col gap-4">
                {[
                  { title: 'PTA Meeting Guide', location: 'Gujarat', stats: '3 schools', badge: true, action: 'View Details' },
                  { title: 'Classroom Activity Sheets', location: 'Karnataka', stats: '250+ students', badge: false, action: 'Download' },
                  { title: 'Parent Awareness Letter', location: 'Punjab', stats: 'Distributed', badge: true, action: 'Download' },
                  { title: 'Session Video Recording', location: 'Pan India', stats: 'Official', badge: true, action: 'Watch Session' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-blue-50 rounded-xl shadow-sm border border-blue-100 p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-900">{item.title}</span>
                      {item.badge && <span className="ml-1 px-2 py-0.5 bg-blue-200 text-blue-800 text-xs rounded-full font-semibold flex items-center gap-1"><svg className="inline-block" width="12" height="12" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#2563eb"/><path d="M17 9l-5.2 5.2-2.8-2.8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Verified</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1"><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#2563eb"/></svg>{item.location}</span>
                      <span className="inline-flex items-center gap-1"><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1118 0 9 9 0 01-18 0zm9-4a1 1 0 100 2 1 1 0 000-2zm1 8h-2v-2h2v2z" fill="#64748b"/></svg>{item.stats}</span>
                    </div>
                    <button className="mt-2 px-3 py-1.5 bg-blue-700 text-white rounded-md shadow hover:bg-blue-800 text-xs font-medium w-max">{item.action}</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="text-sm text-slate-500 mt-8">These resources are curated for community outreach and verified for accuracy. For official procedures always follow your state DBT office guidance.</footer>
      </div>
    </main>
  )
}
