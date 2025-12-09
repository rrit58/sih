import React from 'react'

const steps = [
  { title: 'Link Aadhaar', desc: 'Verify identity by linking Aadhaar with your account.' },
  { title: 'Seed Bank', desc: 'Seed your bank account with Aadhaar for transfers.' },
  { title: 'Scheme Enabled', desc: 'Eligible schemes are enabled for your account.' },
  { title: 'Receive Benefit', desc: 'Funds are credited directly to your account.' },
]

export default function DBTFlow() {
  return (
    <aside className="rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">How DBT Connect Works</h3>
        <span className="text-xs text-slate-500">Step-by-step</span>
      </div>

      <div className="space-y-4">
        {steps.map((s, i) => (
          <div key={s.title} className="flex items-start gap-3 reveal-flow">
            <div className="flex-shrink-0">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center border ${i === 0 ? 'border-teal-400' : i === 1 ? 'border-amber-400' : i === 2 ? 'border-indigo-400' : 'border-green-400'}`} aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v6" stroke="#0f172a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-slate-900">{s.title}</div>
              <div className="text-sm text-slate-600">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .reveal-flow { opacity: 0; transform: translateY(8px); animation: flowIn 520ms ease forwards; }
        .reveal-flow:nth-child(1) { animation-delay: 0ms; }
        .reveal-flow:nth-child(2) { animation-delay: 180ms; }
        .reveal-flow:nth-child(3) { animation-delay: 360ms; }
        .reveal-flow:nth-child(4) { animation-delay: 540ms; }
        @keyframes flowIn { to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </aside>
  )
}
