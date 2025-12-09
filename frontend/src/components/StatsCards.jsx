import React from 'react';

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
      {stats.map((s, i) => (
        <div
          key={i}
          className="group bg-gradient-to-br from-[#eaf1fa] to-blue-50 rounded-2xl shadow-xl flex flex-col items-center justify-center p-7 transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden"
        >
          <div className="absolute right-3 top-3 opacity-10 text-7xl select-none pointer-events-none">
            {s.icon}
          </div>
          <div className="z-10 flex flex-col items-center">
            <div className="mb-2 flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors text-4xl shadow-inner">
              {s.icon}
            </div>
            <div className="text-3xl font-extrabold text-[#003B73] mb-1 drop-shadow-sm animate-fadein">
              {s.value}
            </div>
            <div className="text-base text-slate-700 font-medium tracking-wide text-center">
              {s.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
