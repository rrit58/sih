import React from 'react'
import { Link } from 'react-router-dom'

type Props = {
  title: string
  desc: string
  to: string
  icon?: React.ReactNode
}

export default function PortalCard({ title, desc, to, icon }: Props) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-6 flex flex-col items-start gap-4 hover:shadow-md transition-shadow">
      <div className="h-12 w-12 rounded-md bg-blue-50 flex items-center justify-center text-blue-700">{icon}</div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{desc}</p>
      </div>
      <div className="w-full">
        <Link to={to} className="inline-block mt-2 w-full text-center rounded-md bg-[#003B75] text-white py-2 hover:bg-[#002a50]">Proceed</Link>
      </div>
    </div>
  )
}
