import React from 'react'

type Props = {
  title: string
  href?: string
  variant?: 'blue' | 'green' | 'grey'
  icon?: React.ReactNode
}

const VAR = {
  blue: 'text-[#003B75] bg-white',
  green: 'text-[#006400] bg-white',
  grey: 'text-slate-800 bg-white',
}

export default function QuickLink({ title, href = '#', variant = 'blue', icon }: Props) {
  const cls = `rounded-md border border-slate-200 p-3 flex items-center gap-3 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#003B75] ${VAR[variant]}`
  return (
    <a href={href} className={cls} aria-label={title}>
      <div className="h-9 w-9 flex items-center justify-center rounded-md bg-white border border-slate-100">
        {icon ?? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke="#0f172a" strokeWidth="1.2"/>
          </svg>
        )}
      </div>
      <div className="text-left">
        <div className="text-sm font-medium text-slate-900">{title}</div>
      </div>
    </a>
  )
}
