// src/pages/NearestCenters.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Center {
  _id?: string // MongoDB id
  id: string
  name: string
  address: string
  district: string
  state: string
  pincode?: string
  category: 'CSC' | 'Aadhaar Centre' | 'Banking Correspondent' | 'Other'
  services: string[]
  verified: boolean
  lat: number
  lng: number
  distanceKm?: number
}

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY 

export default function NearestCenters() {
  const { t } = useTranslation()

  // ---------- STATE ----------
  const [query, setQuery] = useState('')
  const [pincode, setPincode] = useState('')
  const [category, setCategory] = useState<'All' | Center['category']>('All')
  const [serviceFilter, setServiceFilter] = useState('')
  const [onlyVerified, setOnlyVerified] = useState(false)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null)
  const [centers, setCenters] = useState<Center[]>([])

  // ---------- REFS ----------
  const mapRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const googleMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const infoWindowsRef = useRef<Record<string, any>>({})

  // ---------- UTIL: Distance ----------
  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (v: number) => (v * Math.PI) / 180
    const R = 6371 // km
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // ---------- LOAD GOOGLE MAPS ----------
  const loadGoogleMaps = (key: string) => {
    return new Promise<void>((resolve, reject) => {
      if (!key) return resolve()
      if ((window as any).google && (window as any).google.maps) return resolve()
      const existing = document.getElementById('gmaps-script')
      if (existing) return resolve()

      const script = document.createElement('script')
      script.id = 'gmaps-script'
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Google Maps'))
      document.head.appendChild(script)
    })
  }

  useEffect(() => {
    loadGoogleMaps(GOOGLE_API_KEY).catch((err) => console.warn('Google Maps load failed', err))
  }, [])

  // ---------- FETCH CENTERS FROM BACKEND ----------
  const fetchCenters = async (opts?: { q?: string; pincode?: string }) => {
    try {
      const params = new URLSearchParams()
      if (opts?.q) params.set('q', opts.q)
      if (opts?.pincode) params.set('pincode', opts.pincode)

      const url =
        params.toString().length > 0
          ? `/api/centers?${params.toString()}`
          : `/api/centers`

      const res = await fetch(url)
      const json = await res.json()

      if (json.success) {
        setCenters(json.data)
      } else {
        setCenters([])
      }
    } catch (err) {
      console.error('Failed to fetch centers:', err)
      setCenters([])
    }
  }

  // Initial load – all centers
  useEffect(() => {
    fetchCenters()
  }, [])

  // ---------- COMPUTE DISTANCES ----------
  const centersWithDistance = useMemo(() => {
    return centers.map((c) => ({
      ...c,
      distanceKm: userLocation
        ? haversineDistance(userLocation.lat, userLocation.lng, c.lat, c.lng)
        : undefined,
    }))
  }, [centers, userLocation])

  // ---------- FILTERING ON FRONTEND ----------
  const filtered = useMemo(() => {
    return centersWithDistance
      .filter((c) => {
        if (category !== 'All' && c.category !== category) return false
        if (onlyVerified && !c.verified) return false
        if (serviceFilter && !c.services.some((s) => s.toLowerCase().includes(serviceFilter.toLowerCase()))) {
          return false
        }
        if (query) {
          const text = [c.name, c.address, c.district, c.state, c.pincode].join(' ').toLowerCase()
          if (!text.includes(query.toLowerCase())) return false
        }
        return true
      })
      .sort((a, b) =>
        a.distanceKm == null
          ? 1
          : b.distanceKm == null
          ? -1
          : (a.distanceKm || 0) - (b.distanceKm || 0),
      )
  }, [centersWithDistance, category, onlyVerified, serviceFilter, query])

  // ---------- INITIALIZE MAP + MARKERS ----------
  useEffect(() => {
    if (viewMode !== 'map') return
    const google = (window as any).google
    if (!google || !google.maps) return
    if (!mapRef.current) return

    if (!googleMapRef.current) {
      googleMapRef.current = new google.maps.Map(mapRef.current, {
        center: userLocation || { lat: 22.0, lng: 78.0 },
        zoom: userLocation ? 12 : 5,
        mapTypeControl: false,
      })
    }

    // Clear existing markers and info windows
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []
    infoWindowsRef.current = {}

    const bounds = new google.maps.LatLngBounds()

    filtered.forEach((c) => {
      const marker = new google.maps.Marker({
        position: { lat: c.lat, lng: c.lng },
        map: googleMapRef.current,
        title: c.name,
      })

      const infoHtml = `
        <div style="max-width:240px">
          <strong>${c.name}</strong>
          <div style="font-size:12px;margin-top:6px">
            ${c.address}<br/>
            ${c.district}, ${c.state} ${c.pincode || ''}<br/>
            <strong>Services:</strong> ${c.services.join(', ')}
            <div style="margin-top:8px;display:flex;gap:6px;">
              <button id="nav-${c.id}"
                style="padding:6px 8px;background:#003B73;color:#fff;border:none;border-radius:4px;cursor:pointer">
                Navigate
              </button>
              <button id="detail-${c.id}"
                style="padding:6px 8px;border-radius:4px;border:1px solid #ddd;background:#fff;cursor:pointer">
                Details
              </button>
            </div>
          </div>
        </div>
      `

      const info = new google.maps.InfoWindow({ content: infoHtml })

      marker.addListener('click', () => {
        info.open(googleMapRef.current, marker)
      })

      google.maps.event.addListener(info, 'domready', () => {
        infoWindowsRef.current[c.id] = { info, marker }

        const navBtn = document.getElementById(`nav-${c.id}`)
        if (navBtn) {
          navBtn.onclick = () => {
            const dest = `${c.lat},${c.lng}`
            const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : ''
            const url = origin
              ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`
              : `https://www.google.com/maps/dir/?api=1&destination=${dest}`
            window.open(url, '_blank')
          }
        }

        const detailBtn = document.getElementById(`detail-${c.id}`)
        if (detailBtn) {
          detailBtn.onclick = () => setSelectedCenter(c)
        }
      })

      markersRef.current.push(marker)
      bounds.extend({ lat: c.lat, lng: c.lng })
    })

    if (filtered.length > 0) {
      googleMapRef.current.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 })
    }

    setTimeout(() => {
      try {
        google.maps.event.trigger(googleMapRef.current, 'resize')
      } catch (e) {}
      if (userLocation) {
        googleMapRef.current.setCenter(userLocation)
      }
    }, 300)
  }, [viewMode, filtered, userLocation])

  // ---------- GEOLOCATION ----------
  const locateUser = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => alert('Unable to get location: ' + err.message),
      { enableHighAccuracy: true },
    )
  }

  // ---------- SEARCH CLICK ----------
  const handleSearchClick = async () => {
    const text = (searchInputRef.current?.value || query || '').trim()
    const pin = pincode.trim()

    await fetchCenters({ q: text || undefined, pincode: pin || undefined })

    // Optionally: move map to first result
    if ((window as any).google && googleMapRef.current) {
      setTimeout(() => {
        if (filtered.length > 0) {
          const first = filtered[0]
          googleMapRef.current.setCenter({ lat: first.lat, lng: first.lng })
          googleMapRef.current.setZoom(12)
        }
      }, 300)
    }
  }

  // ---------- FOCUS ON CENTER FROM LIST ----------
  const focusOnCenter = (c: Center) => {
    setSelectedCenter(c)
    if ((window as any).google && googleMapRef.current) {
      googleMapRef.current.panTo({ lat: c.lat, lng: c.lng })
      googleMapRef.current.setZoom(13)
      const entry = infoWindowsRef.current[c.id]
      if (entry) entry.info.open(googleMapRef.current, entry.marker)
    }
  }

  // ---------- JSX ----------
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container-pad py-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">Nearest Centre Finder</h1>
            <p className="text-sm text-gray-600 mt-1">
              Search by Pincode, state, district or area. View centres on map or list. Select category to
              filter CSC / Aadhaar / Banking correspondent and more.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600">View:</div>
            <button
              className={`px-3 py-1 rounded-md ${
                viewMode === 'map' ? 'bg-[#003B73] text-white' : 'bg-white border'
              }`}
              onClick={() => setViewMode('map')}
            >
              Map
            </button>
            <button
              className={`px-3 py-1 rounded-md ${
                viewMode === 'list' ? 'bg-[#003B73] text-white' : 'bg-white border'
              }`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </div>

        {/* Filters + Search */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <label className="text-xs text-gray-600">Search (pincode / area / district / state)</label>
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., 422101 or Indore or Nashik Road"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600">Pincode (optional)</label>
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="6-digit pincode"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="All">All</option>
                <option value="CSC">CSC</option>
                <option value="Aadhaar Centre">Aadhaar Centre</option>
                <option value="Banking Correspondent">Banking Correspondent</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={handleSearchClick}
                className="w-full md:w-auto px-4 py-2 rounded-md bg-[#003B73] text-white text-sm"
              >
                Search
              </button>
              <button
                onClick={locateUser}
                className="w-full md:w-auto px-4 py-2 rounded-md border text-sm"
              >
                Use Current Location
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <input
                id="onlyVerified"
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
              />
              <label htmlFor="onlyVerified">Only verified centres</label>
            </div>

            <div className="flex items-center gap-2">
              <span>Service filter:</span>
              <input
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                placeholder="e.g., DBT Enrollment"
                className="rounded-md border border-slate-300 px-2 py-1 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mt-6 grid lg:grid-cols-3 gap-4">
          {/* Map / List */}
          <div className={`lg:col-span-2 ${viewMode === 'list' ? 'order-2 lg:order-1' : ''}`}>
            {viewMode === 'map' ? (
              <div className="rounded-xl border border-slate-200 bg-white h-[60vh] overflow-hidden">
                <div ref={mapRef} className="w-full h-full" />
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((c) => (
                  <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-medium">{c.name}</p>
                        <p className="text-sm text-gray-600">{c.address}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {c.district}, {c.state} · {c.pincode}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {c.services.map((s) => (
                            <span
                              key={s}
                              className="text-xs rounded-full bg-slate-100 border border-slate-200 px-2 py-1"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="w-36 shrink-0 text-right">
                        <p className="text-[11px] text-gray-500">Distance</p>
                        <p className="text-sm font-medium">
                          {c.distanceKm != null ? `${c.distanceKm.toFixed(1)} km` : '—'}
                        </p>
                        <div className="mt-2">
                          <button
                            onClick={() =>
                              window.open(
                                `https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`,
                                '_blank',
                              )
                            }
                            className="px-3 py-1.5 rounded-md bg-[#003B73] text-white text-sm"
                          >
                            Navigate
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => focusOnCenter(c)}
                        className="px-3 py-1.5 rounded-md border border-slate-300 text-sm"
                      >
                        View on map
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Nearby centres */}
          <aside className="lg:col-span-1 order-1 lg:order-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4 sticky top-20">
              <h3 className="font-semibold mb-3">Nearby Centres</h3>
              <div className="space-y-3 max-h-[60vh] overflow-auto">
                {filtered.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-md border border-slate-100 hover:bg-slate-50 cursor-pointer"
                    onClick={() => focusOnCenter(c)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-sm">{c.name}</p>
                        <p className="text-xs text-gray-500">
                          {c.district} · {c.pincode}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {c.distanceKm != null ? `${c.distanceKm.toFixed(1)} km` : '—'}
                        </p>
                        <p className="text-xs text-gray-400">{c.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Detail modal */}
        {selectedCenter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-w-2xl w-full bg-white rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{selectedCenter.name}</h2>
                  <p className="text-sm text-gray-600">{selectedCenter.address}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedCenter.district}, {selectedCenter.state} · {selectedCenter.pincode}
                  </p>
                </div>
                <button className="text-gray-600" onClick={() => setSelectedCenter(null)}>
                  ✕
                </button>
              </div>
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">
                    <strong>Category:</strong> {selectedCenter.category}
                  </p>
                  <p className="text-sm">
                    <strong>Verified:</strong> {selectedCenter.verified ? 'Yes' : 'No'}
                  </p>
                  <p className="text-sm">
                    <strong>Pincode:</strong> {selectedCenter.pincode}
                  </p>
                  <p className="text-sm">
                    <strong>Contact:</strong> 1800-XXX-XXXX
                  </p>
                </div>
                <div>
                  <p className="text-sm">
                    <strong>Services:</strong>
                  </p>
                  <ul className="list-disc ml-5 text-sm mt-2">
                    {selectedCenter.services.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${selectedCenter.lat},${selectedCenter.lng}`,
                      '_blank',
                    )
                  }
                  className="px-4 py-2 rounded-md bg-[#003B73] text-white"
                >
                  Navigate
                </button>
                <button
                  onClick={() => setSelectedCenter(null)}
                  className="px-4 py-2 rounded-md border"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Help strip */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
          <div className="grid md:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="font-medium">DBT Helpline</p>
              <p className="text-gray-600">1800-XXX-XXXX</p>
            </div>
            <div>
              <p className="font-medium">Email Support</p>
              <p className="text-gray-600">support@dbtconnect.gov.in</p>
            </div>
            <div>
              <p className="font-medium">Resolve time</p>
              <p className="text-gray-600">Within 24-48 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
