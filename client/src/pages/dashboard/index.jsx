import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateApiKeyModal from '../../components/CreateApiKeyModal';
import ApiKeyCard from '../../components/ApiKeyCard';
import useAuthStore from '../../stores/useAuthStore';
import useKeysStore from '../../stores/useKeysStore';

function DashboardContent() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.loading);
  const logout = useAuthStore((state) => state.logout);

  const keys = useKeysStore((state) => state.keys);
  const keysLoading = useKeysStore((state) => state.loading);
  const fetchKeys = useKeysStore((state) => state.fetchKeys);
  const createKey = useKeysStore((state) => state.createKey);
  const revokeKey = useKeysStore((state) => state.revokeKey);
  const fetchUsage = useKeysStore((state) => state.fetchUsage);
  const usageByKeyId = useKeysStore((state) => state.usageByKeyId);
  const keysError = useKeysStore((state) => state.error);

  const [showModal, setShowModal] = useState(false);
  const [usageLoading, setUsageLoading] = useState({});
  const [revoking, setRevoking] = useState({});

  // Auth guard: redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchKeys();
    }
  }, [authLoading, user, fetchKeys]);

  const handleCreateKey = useCallback(async (formData) => {
    const data = await createKey(formData);
    // Do NOT close the modal automatically so the user can copy the raw key
    return data;
  }, [createKey]);

  const handleRevoke = useCallback(async (keyId) => {
    setRevoking((prev) => ({ ...prev, [keyId]: true }));
    try {
      await revokeKey(keyId);
      return true;
    } catch (err) {
      return false;
    } finally {
      setRevoking((prev) => ({ ...prev, [keyId]: false }));
    }
  }, [revokeKey]);

  const handleViewUsage = useCallback(async (keyId) => {
    setUsageLoading((prev) => ({ ...prev, [keyId]: true }));
    try {
      await fetchUsage(keyId);
    } finally {
      setUsageLoading((prev) => ({ ...prev, [keyId]: false }));
    }
  }, [fetchUsage]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-950 to-red-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin w-12 h-12 mx-auto text-yellow-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>
    );
  }

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
                Welcome back, {user?.name || user?.email || 'User'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-yellow-100 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>

          {keysError && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-800/50 rounded-xl text-red-300">
              {keysError}
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-yellow-200">API Keys</h2>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-yellow-50 font-semibold rounded-xl transition-all"
            >
              Create New Key
            </button>
          </div>

          {keysLoading && keys.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-red-800/50 rounded-xl p-5 border border-red-700/60 animate-pulse">
                  <div className="h-5 bg-red-700/50 rounded w-3/4 mb-4" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-8 bg-red-700/50 rounded" />
                    <div className="h-8 bg-red-700/50 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-12 bg-red-800/30 border border-red-700/50 rounded-2xl">
              <svg className="w-16 h-16 mx-auto text-red-600/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <h3 className="text-xl font-semibold text-yellow-200 mb-2">No API Keys Yet</h3>
              <p className="text-yellow-300/70 mb-6 max-w-xs mx-auto">
                Create your first API key to start rate limiting your endpoints.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-yellow-50 font-semibold rounded-xl transition-all"
              >
                Create Your First Key
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {keys.map((key) => (
                <ApiKeyCard
                  key={key._id}
                  apiKey={key}
                  usage={usageByKeyId[key._id]}
                  onViewUsage={handleViewUsage}
                  onRevoke={handleRevoke}
                  isLoadingUsage={usageLoading[key._id]}
                  isRevoking={revoking[key._id]}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateApiKeyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateKey}
      />
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}