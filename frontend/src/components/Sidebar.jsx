import React from 'react';
import { NavLink } from 'react-router-dom';

const navs = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Create Campaign', to: '/dashboard#create' },
  { label: 'My Campaigns', to: '/dashboard#my-campaigns' },
  { label: 'Reports', to: '/dashboard#reports' },
  { label: 'Profile', to: '/dashboard#profile' },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col min-w-[220px] p-0 bg-gradient-to-b from-[#eaf1fa] to-white border-r border-slate-200 shadow-lg">
      <div className="py-8 px-4 flex flex-col gap-1">
        <div className="mb-6 text-xl font-bold text-[#003B73] tracking-wide pl-2 select-none">Menu</div>
        {navs.map(n => (
          <NavLink
            key={n.label}
            to={n.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 my-1 rounded-l-lg font-medium transition-colors duration-150
              ${isActive ? 'bg-[#e3edfa] text-[#003B73] border-l-4 border-[#003B73] shadow-sm' : 'text-slate-700 hover:bg-blue-50 hover:text-[#003B73]'}
              `
            }
          >
            {n.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
