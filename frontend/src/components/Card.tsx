import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'blue' | 'green' | 'purple' | 'orange' | 'teal'

type Props = {
  title?: string
  icon?: React.ReactNode
  to?: string
  children?: React.ReactNode
  className?: string
  imageUrl?: string
  variant?: Variant
}

const VARIANT_MAP: Record<Variant, { border: string; iconBg: string; hover: string }> = {
  blue: { border: 'border-blue-200', iconBg: 'bg-blue-50', hover: 'from-blue-50 to-blue-100' },
  green: { border: 'border-green-200', iconBg: 'bg-green-50', hover: 'from-green-50 to-green-100' },
  purple: { border: 'border-purple-200', iconBg: 'bg-purple-50', hover: 'from-purple-50 to-purple-100' },
  orange: { border: 'border-amber-200', iconBg: 'bg-amber-50', hover: 'from-amber-50 to-amber-100' },
  teal: { border: 'border-teal-200', iconBg: 'bg-teal-50', hover: 'from-teal-50 to-teal-100' },
}

export default function Card({ title, icon, to, children, className = '', imageUrl, variant = 'blue' }: Props) {
  const v = VARIANT_MAP[variant]
  const base = `group relative rounded-xl border p-0 bg-white transition-transform transform hover:-translate-y-1 focus-within:-translate-y-1 ${v.border} ${className}`

  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // only run in browsers that support IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      el.classList.add('in-view')
      return
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view')
          obs.unobserve(el)
        }
      })
    }, { threshold: 0.12 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const inner = (
    <div ref={ref} className={`reveal ${base}`} tabIndex={to ? -1 : 0}>
      {/* optional image */}
      {imageUrl ? (
        <div className="h-36 w-full overflow-hidden rounded-t-xl">
          <img src={imageUrl} alt={title ?? 'card image'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      ) : null}

      <div className={`p-4 ${imageUrl ? 'pt-4' : 'p-5'}`}>
        <div className="flex items-start gap-4">
          {icon ? <div className={`flex-shrink-0 h-10 w-10 rounded-md ${v.iconBg} text-brand flex items-center justify-center`}>{icon}</div> : null}
          <div className="flex-1">
            {title ? <p className="font-medium text-slate-900">{title}</p> : null}
            <div className="mt-2 text-sm text-slate-600">{children}</div>
          </div>
        </div>
      </div>

      {/* colorful hover accent */}
      <span aria-hidden className={`absolute -bottom-px left-0 right-0 h-1 rounded-b-xl bg-gradient-to-r ${v.hover} opacity-0 group-hover:opacity-100 transition-opacity`} />
    </div>
  )

  if (to) {
    return (
      <Link to={to} className="block" aria-label={title}>
        {inner}
      </Link>
    )
  }

  return inner
}

