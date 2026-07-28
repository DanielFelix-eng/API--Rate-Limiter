import React, { useState } from 'react';

export default function ApiKeyCard({ apiKey, usage, onViewUsage, onRevoke, isLoadingUsage, isRevoking }) {
  const [showUsage, setShowUsage] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formatPlan = (capacity, refillRate) => {
    return `${capacity} burst / ${refillRate} per sec`;
  };

  const handleRevoke = async () => {
    if (await onRevoke(apiKey._id)) {
      setShowConfirm(false);
    }
  };

  const handleToggleUsage = () => {
    const nextShow = !showUsage;
    setShowUsage(nextShow);
    if (nextShow) {
      onViewUsage(apiKey._id);
    }
  };

  return (
    <div className="bg-red-800/50 rounded-xl p-5 border border-red-700/60">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-yellow-200">{apiKey.name || 'Unnamed Key'}</h3>
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                apiKey.active
                  ? 'bg-green-900/30 text-green-300 border border-green-800/30'
                  : 'bg-red-900/30 text-red-300 border border-red-800/30'
              }`}
            >
              {apiKey.active ? 'Active' : 'Revoked'}
            </span>
          </div>
          <p className="text-sm text-yellow-400/70 font-mono">
            {apiKey._id?.slice(0, 8)}...
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-red-900/30 rounded-lg p-3">
          <p className="text-xs text-yellow-400/60 uppercase tracking-wider">Plan</p>
          <p className="text-yellow-200 font-mono text-sm">{formatPlan(apiKey.capacity, apiKey.refillRate)}</p>
        </div>
        <div className="bg-red-900/30 rounded-lg p-3">
          <p className="text-xs text-yellow-400/60 uppercase tracking-wider">This Month</p>
          <p className="text-yellow-200 font-mono text-sm">
            {isLoadingUsage ? (
              <span className="flex items-center gap-1">
                <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading...
              </span>
            ) : (
              usage?.count?.toLocaleString() || '0'
            )}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleToggleUsage}
          disabled={isLoadingUsage}
          className="flex-1 py-2 px-3 bg-red-900/30 border border-red-700/60 hover:bg-red-700/30 text-yellow-200 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {showUsage ? 'Hide Usage' : 'View Usage'}
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          disabled={isRevoking || !apiKey.active}
          className="flex-1 py-2 px-3 bg-red-900/30 border border-red-700/60 hover:bg-red-800/30 text-red-300 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          Revoke
        </button>
      </div>

      {showUsage && usage && (
        <div className="mt-4 p-3 bg-red-900/30 rounded-lg border border-red-700/30">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-yellow-400/60">Month</p>
              <p className="text-yellow-200 font-mono">{usage.month}</p>
            </div>
            <div>
              <p className="text-yellow-400/60">Requests</p>
              <p className="text-yellow-200 font-mono">{usage.count?.toLocaleString() || '0'}</p>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-red-900/95 border border-red-800/50 rounded-2xl p-6 shadow-2xl">
            <h4 className="text-lg font-semibold text-yellow-200 mb-2">Revoke API Key</h4>
            <p className="text-yellow-300/80 mb-4">
              Are you sure you want to revoke <span className="font-mono">{apiKey.name || 'Unnamed Key'}</span>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isRevoking}
                className="flex-1 py-2 px-4 bg-red-800/50 border border-red-700/60 hover:bg-red-700/50 text-yellow-200 font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRevoke}
                disabled={isRevoking}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-yellow-50 font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                {isRevoking ? 'Revoking...' : 'Revoke'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}