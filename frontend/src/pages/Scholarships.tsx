import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

// --- Types ---
export type ScholarshipItem = {
  id: string
  title: string
  state: string
  providerType?: 'Central' | 'State' | 'Private' | string
  degreeLevel?: string
  category?: string
  reservedCategory?: string // e.g., SC/ST/OBC/Disabled
  description?: string
  deadline?: string // ISO
  officialLink?: string
  lastUpdatedDate?: string // ISO
}

export type SearchParams = {
  q?: string
  state?: string
  providerType?: string
  degreeLevel?: string
  category?: string
  reservedCategory?: string
  dateFrom?: string
  dateTo?: string
  sort?: 'relevance' | 'newest' | 'deadline'
  page?: number
  pageSize?: number
}

export type SearchResult = {
  items: ScholarshipItem[]
  total: number
  page: number
  pageSize: number
}

// --- Config ---
const PER_PAGE_DEFAULT = 10
const DEBOUNCE_MS = 300
const USE_INFINITE_SCROLL = false // toggle if you want infinite scroll

// --- Local mock fallback for development ---
const LOCAL_MOCK: ScholarshipItem[] = [
  {
    id: '1',
    title: 'National Means-cum-Merit Scholarship',
    state: 'All-India',
    providerType: 'Central',
    degreeLevel: 'School',
    category: 'General',
    reservedCategory: 'None',
    description: 'Merit-cum-means scholarship for school students from low-income families.',
    deadline: '2025-12-31',
    officialLink: '#',
    lastUpdatedDate: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'State Post-Matric Scholarship (Karnataka)',
    state: 'Karnataka',
    providerType: 'State',
    degreeLevel: 'Post-Matric',
    category: 'SC',
    reservedCategory: 'SC',
    description: 'Support for SC students pursuing post-matric studies in Karnataka.',
    deadline: '2025-11-30',
    officialLink: '#',
    lastUpdatedDate: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Maharashtra Merit Scholarship',
    state: 'Maharashtra',
    providerType: 'State',
    degreeLevel: 'Undergraduate',
    category: 'Merit',
    reservedCategory: 'None',
    description: 'Merit scholarship for top performing students in Maharashtra.',
    deadline: '2025-10-31',
    officialLink: '#',
    lastUpdatedDate: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Kerala Talent Scholarship',
    state: 'Kerala',
    providerType: 'State',
    degreeLevel: 'Postgraduate',
    category: 'Talent',
    reservedCategory: 'None',
    description: 'Scholarship for meritorious postgraduate students in Kerala.',
    deadline: '2025-09-15',
    officialLink: '#',
    lastUpdatedDate: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Bihar Students Assistance',
    state: 'Bihar',
    providerType: 'State',
    degreeLevel: 'Undergraduate',
    category: 'Need-based',
    reservedCategory: 'OBC',
    description: 'Financial assistance for low-income undergraduate students in Bihar.',
    deadline: '2025-12-01',
    officialLink: '#',
    lastUpdatedDate: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Tamil Nadu Higher Education Grant',
    state: 'Tamil Nadu',
    providerType: 'State',
    degreeLevel: 'Undergraduate',
    category: 'General',
    reservedCategory: 'None',
    description: 'Grant for students pursuing higher education in Tamil Nadu.',
    deadline: '2026-01-20',
    officialLink: '#',
    lastUpdatedDate: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'West Bengal Minority Scholarship',
    state: 'West Bengal',
    providerType: 'State',
    degreeLevel: 'All',
    category: 'Minority',
    reservedCategory: 'Minority',
    description: 'Support for students from recognized minority communities in West Bengal.',
    deadline: '2025-12-15',
    officialLink: '#',
    lastUpdatedDate: new Date().toISOString(),
  },
  {
    id: '8',
    title: 'Uttar Pradesh Post-Matric Scholarship',
    state: 'Uttar Pradesh',
    providerType: 'State',
    degreeLevel: 'Post-Matric',
    category: 'SC/ST',
    reservedCategory: 'SC',
    description: 'Post-matric scholarship for eligible students in Uttar Pradesh.',
    deadline: '2025-11-20',
    officialLink: '#',
    lastUpdatedDate: new Date().toISOString(),
  },
  {
    id: '9',
    title: 'Rajasthan Student Assistance Program',
    state: 'Rajasthan',
    providerType: 'State',
    degreeLevel: 'Undergraduate',
    category: 'Need-based',
    reservedCategory: 'None',
    description: 'Need-based assistance for students from economically weaker sections.',
    deadline: '2025-12-10',
    officialLink: '#',
    lastUpdatedDate: new Date().toISOString(),
  },
  {
    id: '10',
    title: 'Punjab Scholarship for Technical Education',
    state: 'Punjab',
    providerType: 'State',
    degreeLevel: 'Diploma/Undergraduate',
    category: 'Technical',
    reservedCategory: 'None',
    description: 'Support for students pursuing technical education in Punjab.',
    deadline: '2025-12-22',
    officialLink: '#',
    lastUpdatedDate: new Date().toISOString(),
  },
  {
    id: '11',
    title: 'Delhi Urban Scholarship',
    state: 'Delhi',
    providerType: 'State',
    degreeLevel: 'All',
    category: 'Urban',
    reservedCategory: 'None',
    description: 'Support for students residing in urban Delhi with financial need.',
    deadline: '2025-12-05',
    officialLink: '#',
    lastUpdatedDate: new Date().toISOString(),
  },
  {
    id: '12',
    title: 'Odisha Merit Scholarship',
    state: 'Odisha',
    providerType: 'State',
    degreeLevel: 'School/Undergraduate',
    category: 'Merit',
    reservedCategory: 'None',
    description: 'Merit scholarship for top performing students in Odisha.',
    deadline: '2025-11-25',
    officialLink: '#',
    lastUpdatedDate: new Date().toISOString(),
  },
]

// --- ScholarshipService with simple client-side caching ---
const ScholarshipService = (() => {
  const cache = new Map<string, SearchResult>()

  function keyFromParams(p: SearchParams) {
    return JSON.stringify({ ...p })
  }

  async function search(params: SearchParams = {}): Promise<SearchResult> {
    const page = params.page || 1
    const pageSize = params.pageSize || PER_PAGE_DEFAULT
    const cacheKey = keyFromParams(params)
    if (cache.has(cacheKey)) {
      // return cached copy immediately (immutable clone)
      const cached = cache.get(cacheKey)!
      return { ...cached, items: cached.items.slice() }
    }

    try {
      const res = await fetch('/api/scholarships')
      if (!res.ok) throw new Error('API error')
      const json = await res.json()
      const all: ScholarshipItem[] = Array.isArray(json) ? json : LOCAL_MOCK

      // client-side filter/sort/paginate
      let list = all.slice()
      const q = (params.q || '').trim().toLowerCase()
      if (q) {
        list = list.filter((s) => (s.title || '').toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q) || (s.state || '').toLowerCase().includes(q))
      }
      if (params.state && params.state !== 'All') list = list.filter((s) => s.state === params.state)
      if (params.providerType) list = list.filter((s) => s.providerType === params.providerType)
      if (params.degreeLevel) list = list.filter((s) => s.degreeLevel === params.degreeLevel)
      if (params.category) list = list.filter((s) => s.category === params.category)
      if (params.reservedCategory) list = list.filter((s) => s.reservedCategory === params.reservedCategory)
      if (params.dateFrom) {
        const from = new Date(params.dateFrom).getTime()
        list = list.filter((s) => (s.deadline ? new Date(s.deadline).getTime() >= from : false))
      }
      if (params.dateTo) {
        const to = new Date(params.dateTo).getTime()
        list = list.filter((s) => (s.deadline ? new Date(s.deadline).getTime() <= to : false))
      }

      if (params.sort === 'newest') {
        list.sort((a, b) => (b.lastUpdatedDate ? new Date(b.lastUpdatedDate).getTime() : 0) - (a.lastUpdatedDate ? new Date(a.lastUpdatedDate).getTime() : 0))
      } else if (params.sort === 'deadline') {
        list.sort((a, b) => (a.deadline ? new Date(a.deadline).getTime() : Infinity) - (b.deadline ? new Date(b.deadline).getTime() : Infinity))
      } else {
        // relevance: put exact title includes first
        const qv = (params.q || '').toLowerCase()
        if (qv) {
          list.sort((a, b) => {
            const ai = (a.title || '').toLowerCase().includes(qv) ? 0 : 1
            const bi = (b.title || '').toLowerCase().includes(qv) ? 0 : 1
            return ai - bi
          })
        }
      }

      const total = list.length
      const start = (page - 1) * pageSize
      const items = list.slice(start, start + pageSize)
      const result: SearchResult = { items, total, page, pageSize }
      cache.set(cacheKey, result)
      return result
    } catch (e) {
      // API failed — return local mock as fallback
      const list = LOCAL_MOCK.slice()
      const total = list.length
      const start = (page - 1) * pageSize
      const items = list.slice(start, start + pageSize)
      const result: SearchResult = { items, total, page, pageSize }
      cache.set(cacheKey, result)
      return result
    }
  }

  return { search }
})()

// --- Component ---
export default function Scholarships(): JSX.Element {
  const { t } = useTranslation()
  const [items, setItems] = useState<ScholarshipItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(PER_PAGE_DEFAULT)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // UI state
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentQueries, setRecentQueries] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('recentQueries') || '[]') } catch { return [] }
  })
  const [suggestions, setSuggestions] = useState<string[]>([])

  // filter state
  const [stateFilter, setStateFilter] = useState('All')
  const [providerType, setProviderType] = useState('All')
  const [degreeLevel, setDegreeLevel] = useState('')
  const [category, setCategory] = useState('')
  const [reservedCategory, setReservedCategory] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortBy, setSortBy] = useState<'relevance'|'newest'|'deadline'>('relevance')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // config
  const infiniteScroll = USE_INFINITE_SCROLL

  // refs
  const debounceRef = useRef<number | null>(null)

  // load page via service with optimistic UI using cache
  const loadPage = useCallback(async (p = 1, params: Partial<SearchParams> = {}) => {
    setLoading(true)
    setError(null)
    try {
      const res = await ScholarshipService.search({
        q: params.q ?? query,
        state: params.state ?? (stateFilter !== 'All' ? stateFilter : undefined),
        providerType: params.providerType ?? (providerType !== 'All' ? providerType : undefined),
        degreeLevel: params.degreeLevel ?? (degreeLevel || undefined),
        category: params.category ?? (category || undefined),
        reservedCategory: params.reservedCategory ?? (reservedCategory || undefined),
        dateFrom: params.dateFrom ?? (dateFrom || undefined),
        dateTo: params.dateTo ?? (dateTo || undefined),
        sort: params.sort ?? sortBy,
        page: p,
        pageSize,
      })
      setItems(res.items)
      setTotal(res.total)
      setPage(res.page)
    } catch (e) {
      setError('Unable to fetch scholarships. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [query, stateFilter, providerType, degreeLevel, category, reservedCategory, dateFrom, dateTo, sortBy, pageSize])

  // initial load
  useEffect(() => { loadPage(1) }, [])

  // debounced live search (300ms) showing suggestions and performing search
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => {
      // suggestions: recent queries + top matching titles (from last loaded items)
      const q = query.trim().toLowerCase()
      const rec = recentQueries.filter((r: string) => r.toLowerCase().includes(q)).slice(0,5)
      const topMatches = items.filter((it: ScholarshipItem) => it.title.toLowerCase().includes(q)).slice(0,5).map((i: ScholarshipItem) => i.title)
      setSuggestions([...new Set([...rec, ...topMatches])])

      // run search
      loadPage(1)
    }, DEBOUNCE_MS)
    return () => { if (debounceRef.current) window.clearTimeout(debounceRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  // handle search button / enter
  const handleSearch = useCallback(() => {
    const q = query.trim()
    if (!q) return loadPage(1)
    // save recent queries
    const next = [q, ...recentQueries.filter((r: string) => r !== q)].slice(0,10)
    setRecentQueries(next)
    try { localStorage.setItem('recentQueries', JSON.stringify(next)) } catch {}
    loadPage(1, { q })
  }, [query, recentQueries, loadPage])

  // clear filters
  const resetFilters = useCallback(() => {
    setQuery('')
    setStateFilter('All')
    setProviderType('All')
    setDegreeLevel('')
    setCategory('')
    setReservedCategory('')
    setDateFrom('')
    setDateTo('')
    setSortBy('relevance')
    loadPage(1, {
      q: '',
      state: undefined,
      providerType: undefined,
      degreeLevel: undefined,
      category: undefined,
      reservedCategory: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      sort: 'relevance',
    })
  }, [loadPage])

  // analytics stub
  const trackApply = (item: ScholarshipItem) => {
    const payload = { event: 'apply_click', title: item.title, provider: item.providerType, searchTerm: query }
    // send to analytics endpoint or console for now
    // eslint-disable-next-line no-console
    console.log('ANALYTICS', payload)
  }

  // pagination controls
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  // state options derived from mock + current items
  const stateOptions = useMemo(() => {
    const set = new Set<string>()
    LOCAL_MOCK.forEach((it: ScholarshipItem) => { if (it.state) set.add(it.state) })
    items.forEach((it: ScholarshipItem) => { if (it.state) set.add(it.state) })
    return ['All', ...Array.from(set).sort()]
  }, [items])

  // degree & category options derived from data
  const degreeOptions = useMemo(() => {
    const s = new Set<string>()
    LOCAL_MOCK.forEach((it: ScholarshipItem) => { if (it.degreeLevel) s.add(it.degreeLevel) })
    items.forEach((it: ScholarshipItem) => { if (it.degreeLevel) s.add(it.degreeLevel) })
    return ['All', ...Array.from(s).filter(Boolean).sort()]
  }, [items])

  const categoryOptions = useMemo(() => {
    const s = new Set<string>()
    LOCAL_MOCK.forEach((it: ScholarshipItem) => { if (it.category) s.add(it.category) })
    items.forEach((it: ScholarshipItem) => { if (it.category) s.add(it.category) })
    return ['All', ...Array.from(s).filter(Boolean).sort()]
  }, [items])

  return (
    <div className="min-h-screen bg-[#F7F8FA] py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold">Scholarship Search</h1>
          <div className="text-sm text-slate-500">{loading ? 'Searching…' : `${total} results`}</div>
        </header>

        {/* Search bar */}
        <div role="search" className="sticky top-4 z-40">
          <div className="rounded-xl bg-white border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <input
                aria-label="Search by name, keyword, eligibility, or state"
                placeholder="Search by name, keyword, eligibility, or state"
                className="w-full pr-40 rounded-full border border-slate-200 px-4 py-3 focus:shadow-md focus:outline-none"
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if ((e as React.KeyboardEvent<HTMLInputElement>).key === 'Enter') handleSearch() }}
              />

              <button onClick={handleSearch} aria-label="Search" className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"/></svg>
                <span className="hidden sm:inline">Search</span>
              </button>

              {/* suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-md shadow-md z-50 max-h-60 overflow-auto">
                  {suggestions.map((s: string) => (
                    <li key={s} className="px-3 py-2 hover:bg-slate-50 cursor-pointer" onMouseDown={() => { setQuery(s); handleSearch() }}>{s}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Filters (desktop) */}
            <div className="hidden sm:flex items-center gap-2">
              <select
                aria-label="State"
                value={stateFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const val = e.target.value
                  setStateFilter(val)
                  loadPage(1, {
                    state: val === 'All' ? undefined : val,
                    providerType: providerType === 'All' ? undefined : providerType,
                    degreeLevel: degreeLevel || undefined,
                    category: category || undefined,
                    sort: sortBy,
                  })
                }}
                className="rounded-full border border-slate-200 px-3 py-2 text-sm"
              >
                { /* dynamic state options */ }
                {stateOptions.map((s: string) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                aria-label="Provider Type"
                value={providerType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const val = e.target.value
                  setProviderType(val)
                  loadPage(1, {
                    state: stateFilter === 'All' ? undefined : stateFilter,
                    providerType: val === 'All' ? undefined : val,
                    degreeLevel: degreeLevel || undefined,
                    category: category || undefined,
                    sort: sortBy,
                  })
                }}
                className="rounded-full border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="All">All Providers</option>
                <option value="Central">Central</option>
                <option value="State">State</option>
                <option value="Private">Private</option>
              </select>
              <select
                aria-label="Sort by"
                value={sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const val = e.target.value as 'relevance'|'newest'|'deadline'
                  setSortBy(val)
                  loadPage(1, {
                    state: stateFilter === 'All' ? undefined : stateFilter,
                    providerType: providerType === 'All' ? undefined : providerType,
                    degreeLevel: degreeLevel || undefined,
                    category: category || undefined,
                    sort: val,
                  })
                }}
                className="rounded-full border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="relevance">Relevance</option>
                <option value="newest">Newest</option>
                <option value="deadline">Deadline</option>
              </select>
              <button onClick={resetFilters} className="rounded-full border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">Reset</button>
            </div>
            {/* mobile filter button */}
            <div className="sm:hidden flex gap-2">
              <button onClick={() => setShowMobileFilters(true)} className="rounded-full border border-slate-200 px-3 py-2 text-sm">Filters</button>
            </div>
          </div>
        </div>

        {/* Results */}

        {/* State quick-filter buttons */}
        <div className="mt-3 overflow-x-auto py-2">
          <div className="flex items-center gap-2">
            {stateOptions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStateFilter(s)
                  loadPage(1, {
                    state: s === 'All' ? undefined : s,
                    providerType: providerType === 'All' ? undefined : providerType,
                    degreeLevel: degreeLevel || undefined,
                    category: category || undefined,
                    sort: sortBy,
                  })
                }}
                className={`px-3 py-1 rounded-full text-sm ${stateFilter === s ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <main className="mt-6">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: pageSize }).map((_, i: number) => (
                <div key={i} className="animate-pulse rounded-xl bg-white p-4 shadow-sm"><div className="h-6 bg-slate-200 rounded mb-2"/><div className="h-4 bg-slate-200 rounded w-3/4 mb-2"/><div className="h-3 bg-slate-200 rounded w-1/2"/></div>
              ))}
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="rounded-lg bg-white p-8 text-center">
              <h3 className="text-lg font-medium">No scholarships found for your filters.</h3>
              <p className="text-sm text-slate-500 mt-2">Try clearing filters or adjusting your search.</p>
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((it: ScholarshipItem) => (
                <article key={it.id} className="rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{it.title}</h3>
                      <div className="text-sm text-slate-500">{it.state} • {it.providerType}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500">Deadline</div>
                      <div className="font-medium">{it.deadline ? new Date(it.deadline).toLocaleDateString() : '—'}</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-3 line-clamp-3">{it.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <a onClick={() => trackApply(it)} href={it.officialLink || '#'} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">Apply Now</a>
                    <div className="text-xs text-slate-400">Updated: {it.lastUpdatedDate ? new Date(it.lastUpdatedDate).toLocaleString() : '—'}</div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && !infiniteScroll && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button disabled={page <= 1} onClick={() => loadPage(page - 1)} className="px-3 py-1 rounded border bg-white">Prev</button>
              <div className="px-3 py-1">{page} / {totalPages}</div>
              <button disabled={page >= totalPages} onClick={() => loadPage(page + 1)} className="px-3 py-1 rounded border bg-white">Next</button>
            </div>
          )}
        </main>
        {/* Mobile filter sheet */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4 shadow-xl max-h-[70vh] overflow-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="text-sm text-slate-500">Close</button>
              </div>
              <div className="space-y-3">
                <label className="block text-sm">State</label>
                <select value={stateFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStateFilter(e.target.value)} className="w-full rounded-md border p-2">
                  {stateOptions.map((s: string) => <option key={s} value={s}>{s}</option>)}
                </select>

                <label className="block text-sm">Provider</label>
                <select value={providerType} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setProviderType(e.target.value)} className="w-full rounded-md border p-2">
                  <option value="All">All Providers</option>
                  <option value="Central">Central</option>
                  <option value="State">State</option>
                  <option value="Private">Private</option>
                </select>

                <label className="block text-sm">Sort</label>
                <select value={sortBy} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as any)} className="w-full rounded-md border p-2">
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest</option>
                  <option value="deadline">Deadline</option>
                </select>

                <div className="flex gap-2 mt-2">
                  <button onClick={() => { loadPage(1, { state: stateFilter === 'All' ? undefined : stateFilter, providerType: providerType === 'All' ? undefined : providerType, degreeLevel: degreeLevel || undefined, category: category || undefined, sort: sortBy }); setShowMobileFilters(false) }} className="flex-1 rounded-md bg-blue-600 text-white px-3 py-2">Apply</button>
                  <button onClick={() => { resetFilters(); setShowMobileFilters(false) }} className="flex-1 rounded-md border px-3 py-2">Reset</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
