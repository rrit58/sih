import React from 'react';

export default function CampaignList({ campaigns, onView, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-lg font-semibold text-blue-900 mb-3">My Campaigns</div>
      <div className="flex flex-col gap-4">
        {campaigns.length === 0 && <div className="text-slate-500">No campaigns yet.</div>}
        {campaigns.map(c => (
          <div key={c.id} className="bg-blue-50 rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="font-bold text-blue-900 text-base">{c.title}</div>
              <div className="text-xs text-slate-500 mb-1">{c.date}</div>
              <div className="text-slate-700 mb-1">Status: <span className="font-semibold">{c.status}</span></div>
              {c.images && c.images.length > 0 && (
                <img src={typeof c.images[0] === 'string' ? c.images[0] : URL.createObjectURL(c.images[0])} alt="thumb" className="w-16 h-16 rounded object-cover mb-1" />
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => onView(c)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">View Details</button>
              <button onClick={() => onEdit(c.id, c)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs">Edit</button>
              <button onClick={() => onDelete(c.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
