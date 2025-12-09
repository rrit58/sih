import React, { useEffect } from 'react'

interface Campaign {
  id: string
  panchayat: string
  district: string
  state: string
  date: string
  photos: number
  title: string
  status: 'Verified' | 'Pending'
}

interface ModalProps {
  campaign: Campaign | null
  onClose: () => void
}

export default function GramPanchayatModal({ campaign, onClose }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!campaign) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#003B73] to-blue-600 text-white p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{campaign.panchayat}</h2>
            <p className="text-blue-100 text-sm mt-1">{campaign.district}, {campaign.state}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Date */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-2">Status</p>
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm ${
                  campaign.status === 'Verified'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current" />
                {campaign.status}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600 mb-2">Date Submitted</p>
              <p className="font-semibold text-slate-900">{campaign.date}</p>
            </div>
          </div>

          {/* Campaign Title */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-xs text-slate-600 font-medium mb-2">Campaign Activity</p>
            <p className="text-lg font-semibold text-slate-900">{campaign.title}</p>
          </div>

          {/* Photos Count */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-xs text-blue-600 font-medium mb-1">Photos Attached</p>
              <p className="text-3xl font-bold text-blue-600">{campaign.photos}</p>
              <p className="text-xs text-blue-600 mt-1">files</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <p className="text-xs text-purple-600 font-medium mb-1">Document ID</p>
              <p className="text-sm font-mono text-purple-600 break-all">{campaign.id}</p>
            </div>
          </div>

          {/* Photo Gallery Placeholder */}
          <div>
            <p className="text-sm font-semibold text-slate-900 mb-3">Attached Photos</p>
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: Math.min(campaign.photos, 6) }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center text-2xl hover:scale-105 transition"
                >
                  📷
                </div>
              ))}
            </div>
          </div>

          {/* Campaign Details */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-600 font-medium mb-1">Panchayat Name</p>
                <p className="text-sm font-semibold text-slate-900">{campaign.panchayat}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium mb-1">District</p>
                <p className="text-sm font-semibold text-slate-900">{campaign.district}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium mb-1">State</p>
                <p className="text-sm font-semibold text-slate-900">{campaign.state}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium mb-1">Total Photos</p>
                <p className="text-sm font-semibold text-slate-900">{campaign.photos}</p>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="font-semibold text-blue-900 mb-2">Verification Status</p>
            <p className="text-sm text-blue-800">
              {campaign.status === 'Verified'
                ? '✓ This campaign has been reviewed and verified by administrators.'
                : '⏳ This campaign is pending verification. Our team will review it shortly.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-100 text-slate-900 rounded-lg font-medium hover:bg-slate-200 transition"
            >
              Close
            </button>
            <button className="flex-1 px-4 py-2 bg-[#003B73] text-white rounded-lg font-medium hover:bg-[#003366] transition">
              Download Report
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  )
}
