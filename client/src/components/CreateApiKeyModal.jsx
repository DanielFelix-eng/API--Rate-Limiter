import React, { useState, useEffect } from 'react';

export default function CreateApiKeyModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    name: '',
    capacity: 20,
    refillRate: 5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdKey, setCreatedKey] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', capacity: 20, refillRate: 5 });
      setCreatedKey(null);
      setError('');
      setCopied(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await onCreate(formData);
      setCreatedKey(data.key);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (createdKey) {
      await navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' || name === 'refillRate' ? Number(value) : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-red-900/95 border border-red-800/50 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-yellow-200">Create API Key</h2>
            <button
              onClick={onClose}
              className="p-2 text-yellow-400 hover:text-yellow-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {createdKey ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-900/30 border border-green-800/50 rounded-xl">
                <p className="text-sm text-green-300 mb-2">API Key created successfully!</p>
                <p className="text-xs text-green-400/80 mb-3">
                  Copy this key now. It won&apos;t be shown again.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={createdKey}
                    className="flex-1 px-3 py-2 bg-red-800/50 border border-red-700/60 rounded-lg text-yellow-100 text-sm font-mono"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-yellow-50 font-medium rounded-lg transition-all"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-yellow-50 font-semibold rounded-xl transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-yellow-200 mb-1">
                  Name (optional)
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Production API"
                  className="w-full px-3 py-2 bg-red-800/50 border border-red-700/60 rounded-lg text-yellow-100 placeholder-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                />
              </div>

              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-yellow-200 mb-1">
                  Capacity (requests per window)
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min={1}
                  max={10000}
                  className="w-full px-3 py-2 bg-red-800/50 border border-red-700/60 rounded-lg text-yellow-100 placeholder-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                />
                <p className="text-xs text-yellow-400/60 mt-1">
                  Maximum tokens in the bucket. Default: 20
                </p>
              </div>

              <div>
                <label htmlFor="refillRate" className="block text-sm font-medium text-yellow-200 mb-1">
                  Refill Rate (requests per second)
                </label>
                <input
                  type="number"
                  id="refillRate"
                  name="refillRate"
                  value={formData.refillRate}
                  onChange={handleChange}
                  min={0.1}
                  max={1000}
                  step={0.1}
                  className="w-full px-3 py-2 bg-red-800/50 border border-red-700/60 rounded-lg text-yellow-100 placeholder-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
                />
                <p className="text-xs text-yellow-400/60 mt-1">
                  Tokens added per second. Default: 5
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 px-4 bg-red-800/50 border border-red-700/60 hover:bg-red-700/50 text-yellow-200 font-medium rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-yellow-50 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    'Create Key'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}