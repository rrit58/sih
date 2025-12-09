import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function getDashboardName(category, customName) {
  if (customName) return customName;
  if (category === 'NGO') return 'Nari Shakti NGO';
  if (category === 'School') return 'ST Paul Academy';
  if (category === 'Panchayat') return 'Rampur Gram Panchayat';
  return 'Dashboard';
}

export default function Dashboard() {
  const { t } = useTranslation();
  const location = useLocation();
  const { category = '', dashboardName = '' } = location.state || {};
  const [campaigns, setCampaigns] = useState([
    { title: 'Clean Water Drive', desc: 'Awareness campaign for clean water.', images: [], video: null },
    { title: 'Scholarship Info', desc: 'Session on new scholarships.', images: [], video: null },
  ]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };
  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !desc) return;
    setCampaigns([
      { title, desc, images, video },
      ...campaigns,
    ]);
    setTitle('');
    setDesc('');
    setImages([]);
    setVideo(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">
          {getDashboardName(category, dashboardName)} Dashboard
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Campaign Title"
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
          <div className="flex flex-col gap-2">
            <label className="font-medium text-slate-700">Upload Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="border border-slate-200 rounded-lg px-4 py-2"
              onChange={handleImageChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-slate-700">Upload Video</label>
            <input
              type="file"
              accept="video/*"
              className="border border-slate-200 rounded-lg px-4 py-2"
              onChange={handleVideoChange}
            />
          </div>
          <button
            type="submit"
            className="mt-2 px-6 py-2 bg-[#003B73] hover:bg-[#003366] text-white rounded-lg font-medium transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="w-full max-w-2xl">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Previous Campaigns</h3>
        <div className="flex flex-col gap-4">
          {campaigns.map((c, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-4">
              <div className="font-bold text-slate-900">{c.title}</div>
              <div className="text-slate-700 mb-2">{c.desc}</div>
              {c.images && c.images.length > 0 && (
                <div className="flex gap-2 mb-2">
                  {Array.from(c.images).map((img, i) => (
                    <span key={i} className="inline-block w-16 h-16 bg-slate-100 rounded overflow-hidden">
                      <img
                        src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                        alt=""
                        className="object-cover w-full h-full"
                      />
                    </span>
                  ))}
                </div>
              )}
              {c.video && (
                <video controls className="w-40 h-24 rounded">
                  <source src={typeof c.video === 'string' ? c.video : URL.createObjectURL(c.video)} />
                </video>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
