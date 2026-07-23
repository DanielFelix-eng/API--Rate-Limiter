import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 to-red-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-900/80 rounded-2xl border border-red-800/50 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-yellow-200 mb-2">
                Dashboard
              </h1>
              <p className="text-yellow-300">
                Welcome to your dashboard!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-yellow-100 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-800/50 rounded-xl p-6 border border-red-700/60">
              <h2 className="text-lg font-semibold text-yellow-200 mb-2">Profile</h2>
              <p className="text-yellow-300/70">Manage your account settings</p>
            </div>
            <div className="bg-red-800/50 rounded-xl p-6 border border-red-700/60">
              <h2 className="text-lg font-semibold text-yellow-200 mb-2">Activity</h2>
              <p className="text-yellow-300/70">View your recent activity</p>
            </div>
            <div className="bg-red-800/50 rounded-xl p-6 border border-red-700/60">
              <h2 className="text-lg font-semibold text-yellow-200 mb-2">Settings</h2>
              <p className="text-yellow-300/70">Customize your experience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

