import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import apiUtils from '../utils/apiUtils';

const VerifyEmailPage = () => {
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if we're coming from a verification email link
    const token = searchParams.get('token');
    
    if (token) {
      // This is a password reset flow, not email verification
      // We'll handle it in the reset password page
      navigate(`/reset-password?token=${token}`, { replace: true });
    }
  }, [navigate, searchParams]);

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const data = await apiUtils.verifyEmail(code);
      setSuccessMessage(data.message || 'Email verified successfully!');
      setTimeout(() => {
        navigate(`/login`);
      }, 1500);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 to-red-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-red-900/80 bg-opacity-70 rounded-2xl border border-red-800/50 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-200 mb-4">
            Verify Your Email
          </h1>
          <p className="text-yellow-300 mb-6">
            Please enter the verification code sent to your email
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-800/50 rounded-xl text-red-300">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-800/50 rounded-xl text-green-200">
            {successMessage}
          </div>
        )}

        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }} className="space-y-6">
          <div>
            <label htmlFor="verificationCode" className="block text-sm font-medium text-yellow-200 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              id="verificationCode"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 bg-red-800/50 border border-red-700/60 rounded-xl text-yellow-100 placeholder-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-300"
              placeholder="Enter verification code"
              aria-invalid={!!errors.code}
            >
            </input>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-yellow-50 font-semibold rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Verifying code...
              </>
            ) : (
              'Verify Email'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-yellow-300">
          <p className="text-sm">
            Didn't receive the code? <Link
              to="/forgot-password"
              className="font-medium text-yellow-200 hover:text-yellow-100 transition-colors"
            >
              Request a new code
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;