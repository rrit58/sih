import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProfileCard from '../components/ProfileCard';
import StatsCards from '../components/StatsCards';
import CampaignForm from '../components/CampaignForm';
import CampaignList from '../components/CampaignList';
import DetailsModal from '../components/DetailsModal';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import dummyData from '../data/roleDummyData';

// Utility to get user from localStorage/JWT/context (simulate for now)
function getUser() {
  // Simulate: get from localStorage or context
  // Example: { role: 'NGO', name: 'NGO', ... }
  const user = JSON.parse(localStorage.getItem('user')) || dummyData.defaultUser;
  return user;
}


export default function CommonDashboard() {
  const { t } = useTranslation();
  const [user, setUser] = useState(getUser());
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCampaigns(dummyData.campaigns.filter(c => c.role === user.role));
  }, [user]);

  const stats = dummyData.getStats(user.role, campaigns);
  const profile = dummyData.getProfile(user.role, user, campaigns);
  const formFields = dummyData.getFormFields(user.role);

  const handleCreateCampaign = (data) => {
    setCampaigns([{ ...data, id: Date.now(), role: user.role, status: 'Pending', date: new Date().toISOString().slice(0,10) }, ...campaigns]);
  };
  const handleViewDetails = (campaign) => {
    setSelectedCampaign(campaign);
    setShowModal(true);
  };
  const handleEdit = (id, updated) => {
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, ...updated } : c));
  };
  const handleDelete = (id) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };


  // Detect hash for sidebar navigation
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const isProfile = hash === '#profile';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#eaf1fa] via-white to-[#f0f4fa]">
      <Navbar onLogout={handleLogout} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 px-2 md:px-8 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Section: Analytics Hero */}
            <section className="relative mb-14 w-full">
              <div className="absolute inset-0 -z-10 flex justify-center items-center">
                <div className="w-full h-64 md:h-72 bg-gradient-to-br from-blue-50 via-blue-100 to-white rounded-3xl blur-2xl opacity-70" />
              </div>
              <div className="flex flex-col items-center justify-center text-center py-10 md:py-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#003B73] mb-3 tracking-tight drop-shadow-sm">
                  Welcome, <span className="text-blue-700">{profile.name}</span>
                </h1>
                <p className="text-slate-600 text-lg md:text-2xl mb-8 max-w-2xl">Your organization’s impact at a glance. Track campaigns, approvals, and more below.</p>
                <div className="w-full max-w-5xl">
                  <StatsCards stats={stats} />
                </div>
              </div>
            </section>

            {/* Section: Profile (only if #profile) */}
            {isProfile && (
              <div className="mb-12">
                <div className="mb-2 text-lg font-semibold text-[#003B73]">Profile Summary</div>
                <div className="rounded-2xl shadow-xl bg-white/90 backdrop-blur-sm p-4 md:p-6 max-w-lg">
                  <ProfileCard profile={profile} />
                </div>
              </div>
            )}

            {/* Section: Campaigns (hide if profile) */}
            {!isProfile && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="col-span-1">
                  <div className="mb-2 text-lg font-semibold text-[#003B73]">Create Campaign</div>
                  <div className="rounded-2xl shadow-xl bg-white/90 backdrop-blur-sm p-4 md:p-6">
                    <CampaignForm fields={formFields} onSubmit={handleCreateCampaign} />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="mb-2 text-lg font-semibold text-[#003B73]">My Campaigns</div>
                  <div className="rounded-2xl shadow-xl bg-white/90 backdrop-blur-sm p-4 md:p-6">
                    <CampaignList
                      campaigns={campaigns}
                      onView={handleViewDetails}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      {showModal && (
        <DetailsModal
          campaign={selectedCampaign}
          userRole={user.role}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
