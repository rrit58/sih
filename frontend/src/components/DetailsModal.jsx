import React from 'react';

export default function DetailsModal({ campaign, userRole, onClose }) {
  if (!campaign) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 text-xl">×</button>
        <div className="text-2xl font-bold text-blue-900 mb-2">{campaign.title}</div>
        <div className="text-slate-700 mb-2">{campaign.description}</div>
        <div className="text-xs text-slate-500 mb-2">{campaign.date}</div>
        <div className="mb-2">
          {campaign.images && campaign.images.length > 0 && (
            <div className="flex gap-2 mb-2">
              {Array.from(campaign.images).map((img, i) => (
                <img key={i} src={typeof img === 'string' ? img : URL.createObjectURL(img)} alt="img" className="w-16 h-16 rounded object-cover" />
              ))}
            </div>
          )}
          {campaign.video && (
            <video controls className="w-full h-40 rounded">
              <source src={typeof campaign.video === 'string' ? campaign.video : URL.createObjectURL(campaign.video)} />
            </video>
          )}
        </div>
        {/* Role-specific fields */}
        <div className="mt-2">
          {userRole === 'NGO' && (
            <>
              <div className="text-slate-700"><span className="font-semibold">Organization Name:</span> {campaign.organizationName}</div>
              <div className="text-slate-700"><span className="font-semibold">Volunteers Count:</span> {campaign.volunteersCount}</div>
            </>
          )}
          {userRole === 'School' && (
            <>
              <div className="text-slate-700"><span className="font-semibold">School Name:</span> {campaign.schoolName}</div>
              <div className="text-slate-700"><span className="font-semibold">Principal Name:</span> {campaign.principalName}</div>
              <div className="text-slate-700"><span className="font-semibold">Student Count:</span> {campaign.studentCount}</div>
            </>
          )}
          {userRole === 'Panchayat' && (
            <>
              <div className="text-slate-700"><span className="font-semibold">Panchayat Name:</span> {campaign.panchayatName}</div>
              <div className="text-slate-700"><span className="font-semibold">Ward Number:</span> {campaign.wardNumber}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
