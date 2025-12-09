import React from 'react'

type Props = {
  title: string
  description?: string
  date?: string
  href?: string
  icon?: React.ReactNode
}

export default function AnnouncementCard({ title, description, date, href, icon }: Props) {
  return (
    <article className="bg-[#F5F5F5] border border-slate-200 rounded-md p-4" aria-labelledby={`ann-${title.replace(/\s+/g, '-')}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <div className="h-10 w-10 rounded-md bg-white border border-slate-200 flex items-center justify-center" aria-hidden>
            {icon ?? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v6" stroke="#0f172a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 8v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </div>
        </div>

        <div className="flex-1">
          <h4 id={`ann-${title.replace(/\s+/g, '-')}`} className="text-base font-semibold text-slate-900">{title}</h4>
          {description ? <p className="mt-1 text-sm text-slate-700">{description}</p> : null}
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-slate-600">{date}</div>
            {href ? (
              <a href={href} className="text-[#003B75] text-sm font-medium hover:underline" aria-label={`Read more about ${title}`}>Read more</a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}
