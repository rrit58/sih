import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Card from '../components/Card'
import HeroCarousel from '../components/HeroCarousel'
import GalleryCarousel from '../components/GalleryCarousel'
import AadhaarImpactDashboard from '../components/stat.jsx'
// 

export default function Home() {
  const { t } = useTranslation()

  return (
    <div>
      {/* Hero */}
      <section className="bg-white">
        <div className="container-pad py-10 lg:py-16">
          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-5 flex items-center">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">{t('hero.title')}</h1>
                <p className="mt-4 text-slate-700">{t('hero.description')}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/checker" className="px-4 py-2 rounded-md bg-brand text-white hover:bg-brandDark">{t('hero.checkStatus')}</Link>
                  <Link to="/scholarships" className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50">{t('hero.browseScholarships')}</Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="h-full min-h-[280px] lg:min-h-[420px] bg-blue-50 rounded-2xl border border-slate-200 p-3 shadow-sm">
                <HeroCarousel images={[
                  '/Add a heading (1).png',
                  '/Add a heading (2).mp4',
                  '/Add a heading (3).png'
                ]} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand text-white">
        <div className="container-pad py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            ['5.2M+', t('stats.beneficiaries')],
            ['850K+', t('stats.scholarships')],
            ['15,000+', t('stats.helpCenters')],
            ['2,500+', t('stats.ngos')],
          ].map(([val, label]) => (
            <div key={label as string}>
              <p className="text-2xl font-bold">{val}</p>
              <p className="text-sm text-blue-100">{label}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Services */}
      <section className="bg-white">
        <div className="container-pad py-12">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('services.title')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              [t('services.dbtStatus'), '/checker', '🔎', 'teal', t('services.dbtStatusDesc')],
              [t('services.scholarships'), '/scholarships', '🎓', 'purple', t('services.scholarshipsDesc')],
              [t('services.nearestCenters'), '#', '📍', 'orange', t('services.nearestCentersDesc')],
              [t('services.ngoPortal'), '#', '🤝', 'green', t('services.ngoPortalDesc')],
            ].map(([title, link, icon, variant, desc]) => (
              <Card key={title as string} title={title as string} icon={icon as string} to={link as string} variant={variant as any}>
                <p className="text-sm text-gray-500 mt-2">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements & Quick Access (GIGW-style) */}
      <section aria-labelledby="announcements-heading" className="bg-white">
        <div className="container-pad py-10">
          <div className="grid lg:grid-cols-2 gap-8 items-start">

            {/* Latest Announcements */}
            <aside aria-labelledby="announcements-heading" className="">
              <h2 id="announcements-heading" className="text-2xl font-semibold text-slate-900 mb-4">{t('announcements')}</h2>

              <div className="space-y-3">
                {/* Announcement list (light grey cards) */}
                {[{title:'New PM-XXX Scholarship Application Open', date:'01 Nov 2025', desc:'Applications are open for eligible students. Check eligibility and apply through the portal.'},{title:'DBT Seeding Camp - District Lakshmi', date:'21 Oct 2025', desc:'Local seeding camp to assist beneficiaries with Aadhaar seeding and bank linkage.'},{title:'Updated Guidelines for NGO Registration', date:'10 Oct 2025', desc:'New simplified process for NGO registration; read the official notification.'},{title:'Upcoming Awareness Materials', date:'05 Oct 2025', desc:'Awareness materials for beneficiaries will be published shortly.'}].map((a, i) => (
                  <article key={a.title} className="bg-[#F5F5F5] border border-slate-200 rounded-lg p-4 focus-within:ring-2 focus-within:ring-[#003B75]" aria-labelledby={`ann-${i}-title`}>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-700" aria-hidden>
                          <svg className="h-5 w-5 text-slate-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16v12H4z" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 8h8" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 id={`ann-${i}-title`} className="text-base font-semibold text-slate-900">{a.title}</h3>
                        <p className="mt-1 text-sm text-slate-700">{a.desc}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <time className="text-xs text-slate-600" dateTime={a.date}>{a.date}</time>
                          <a href="#" className="text-[#003B75] text-sm font-medium hover:underline" aria-label={`Read more about ${a.title}`}>Read more</a>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}

                <div className="mt-2">
                  <a href="/announcements" className="inline-block text-[#003B75] font-medium hover:underline" aria-label="View all announcements">View all announcements</a>
                </div>
              </div>
            </aside>

            {/* Quick Access / Important Links */}
            <nav aria-labelledby="quick-links-heading" className="">
              <h2 id="quick-links-heading" className="text-2xl font-semibold text-slate-900 mb-4">{t('quickAccess')}</h2>

              <p className="text-sm text-slate-700 mb-4">{t('frequentlyUsed')}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                {[
                  {title: t('awarenessResources'), href:'#', icon:'book'},
                  {title: t('helpSupport'), href:'#', icon:'phone'},
                  {title: t('downloads'), href:'#', icon:'download'},
                  {title: t('mobileApp'), href:'#', icon:'mobile'},
                  {title: t('centerLocator'), href:'#', icon:'map'},
                  {title: t('services.ngoPortal'), href:'#', icon:'link'},
                ].map((item) => (
                  <a key={item.title} href={item.href} className="group flex items-center gap-3 rounded-lg border border-slate-200 p-3 bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#003B75]" aria-label={item.title}>
                    <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#F8FAFC] border border-slate-100 text-[#003B75]">
                      {/* neutral line icons */}
                      {item.icon === 'book' ? (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M3 5a2 2 0 012-2h11a2 2 0 012 2v14a1 1 0 01-1 1H6a3 3 0 01-3-3V5z" stroke="#003B75" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      ) : item.icon === 'phone' ? (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M22 16.92V20a2 2 0 01-2.18 2A19.86 19.86 0 013 5.18 2 2 0 015 3h3.09a1 1 0 01.94.66l1.2 3.52a1 1 0 01-.24 1.02L8.91 11.09a12 12 0 006 6l2.9-2.09a1 1 0 011.02-.24l3.52 1.2c.36.12.6.48.66.94z" stroke="#003B75" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      ) : item.icon === 'download' ? (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="#003B75" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 10l5 5 5-5" stroke="#003B75" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 15V3" stroke="#003B75" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      ) : item.icon === 'mobile' ? (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><rect x="7" y="2" width="10" height="20" rx="2" stroke="#003B75" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 18h2" stroke="#003B75" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      ) : item.icon === 'map' ? (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M20.5 3l-5 2-5-2-7.5 3.5V21l7.5-3 5 2 7.5-3.5V3z" stroke="#003B75" strokeWidth="1.25" strokeLinejoin="round" strokeLinecap="round"/></svg>
                      ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M3 7h18M3 12h18M3 17h18" stroke="#003B75" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                    </span>

                    <div className="text-left">
                      <div className="text-sm font-medium text-slate-900 group-hover:text-[#003B75]">{item.title}</div>
                    </div>
                  </a>
                ))}
                <AadhaarImpactDashboard/>
              </div>
            </nav>
          </div>
        </div>
      </section>

      {/* How DBT Works */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-50 via-white to-rose-50">
        {/* decorative shapes */}
        <svg className="absolute -right-20 -top-20 opacity-20 w-96 h-96 pointer-events-none" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <circle cx="200" cy="200" r="180" fill="url(#g1)" />
        </svg>
        <svg className="absolute -left-40 -bottom-24 opacity-10 w-72 h-72 pointer-events-none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <circle cx="100" cy="100" r="90" fill="#06b6d4" />
        </svg>

        <div className="container-pad relative z-10 py-12">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('howWorks')}</h2>

          <p className="max-w-2xl mx-auto text-center text-sm text-slate-700 mb-8">A simplified flow explaining how Direct Benefit Transfer reaches citizens — from identity linking to bank transfer and tracking.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { title: t('aadhaarLinking'), desc: t('aadhaarDesc'), variant: 'teal' },
              { title: t('ngoMapping'), desc: t('ngoMappingDesc'), variant: 'orange' },
              { title: t('government'), desc: t('governmentDesc'), variant: 'purple' },
              { title: t('directTransfer'), desc: t('directTransferDesc'), variant: 'green' },
              { title: t('notifications'), desc: t('notificationsDesc'), variant: 'blue' },
            ].map((s, idx) => (
              <Card
                key={s.title}
                title={`${idx + 1}. ${s.title}`}
                className="bg-white/90 backdrop-blur-sm"
                variant={(s as any).variant}
                icon={<span className="text-sm font-semibold text-slate-700">{idx + 1}</span>}
              >
                <p className="text-sm text-slate-700">{(s as any).desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-slate-50">
        <div className="container-pad py-10">
          <div className="mb-6">
           </div>

          <GalleryCarousel images={[
            'https://preview.thenewsmarket.com/Previews/INTE/StillAssets/960x540/621151_v2.jpg',
            'https://tse4.mm.bing.net/th/id/OIP.TiZbZYk7h-fF3MFG2J33MQHaDx?rs=1&pid=ImgDetMain&o=7&rm=3',
            'https://www.namtheun2.com/wp-content/uploads/2025/02/Long-Term-Scholarship-Awaereness-2025.1.jpeg',
            'https://preview.thenewsmarket.com/Previews/INTE/StillAssets/960x540/621151_v2.jpg',
            'https://preview.thenewsmarket.com/Previews/INTE/StillAssets/960x540/621151_v2.jpg',
            'https://tse4.mm.bing.net/th/id/OIP.TiZbZYk7h-fF3MFG2J33MQHaDx?rs=1&pid=ImgDetMain&o=7&rm=3',
            'https://preview.thenewsmarket.com/Previews/INTE/StillAssets/960x540/621151_v2.jpg',
            'https://tse4.mm.bing.net/th/id/OIP.TiZbZYk7h-fF3MFG2J33MQHaDx?rs=1&pid=ImgDetMain&o=7&rm=3',
          ]} />
        </div>
      </section>
    </div>
  )
}