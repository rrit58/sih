import React from 'react';

export default function ProfileCard({ profile }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col gap-2 min-h-[220px]">
      <div className="text-lg font-bold text-blue-900 mb-1">Profile Summary</div>
      <div className="text-slate-700"><span className="font-semibold">Name:</span> {profile.name}</div>
      <div className="text-slate-700"><span className="font-semibold">Role:</span> {profile.role}</div>
      <div className="text-slate-700"><span className="font-semibold">Registration ID:</span> {profile.registrationId}</div>
      <div className="text-slate-700"><span className="font-semibold">District/State:</span> {profile.districtState}</div>
      <div className="text-slate-700"><span className="font-semibold">Last Login:</span> {profile.lastLogin}</div>
      <div className="text-slate-700"><span className="font-semibold">Total Campaigns:</span> {profile.totalCampaigns}</div>
    </div>
  );
}
