import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Google OAuth flow
    // In a real app, you would redirect to Google's OAuth endpoint
    // For now, we'll simulate by redirecting to our backend endpoint
    
    const initiateGoogleAuth = async () => {
      try {
        // This would typically be a redirect to Google OAuth
        // For demo purposes, we'll call our backend endpoint
        const response = await fetch('/api/googleAuth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // In real implementation, these would come from Google OAuth callback
            // For now, we'll redirect to Google's OAuth endpoint
          }),
          credentials: 'include',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Google authentication failed');
        }
        
        // On success, redirect to dashboard or home
        navigate('/');
      } catch (error) {
        console.error('Google auth error:', error);
        // Redirect to login with error message
        navigate(`/login?error=${encodeURIComponent(error.message)}`);
      }
    };

    // Actually, for Google OAuth, we should redirect to Google's endpoint
    // Let's do that instead
    const googleClientId = 'YOUR_GOOGLE_CLIENT_ID_HERE'; // This should come from env
    const redirectUri = encodeURIComponent(window.location.origin + '/google-auth');
    const scope = 'openid email profile';
    const responseType = 'code';
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&access_type=offline`;
    
    // Redirect to Google OAuth
    window.location.href = googleAuthUrl;
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-950 to-red-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-red-900/80 bg-opacity-70 rounded-2xl border border-red-800/50 p-8 text-center">
        <h1 className="text-3xl font-bold text-yellow-200 mb-4">
          Google Authentication
        </h1>
        <p className="text-yellow-300 mb-6">
          Sign in with Google to continue building amazing things
        </p>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full max-w-xs">
            <button 
              onClick={() => {
                // This would trigger the Google OAuth flow
                // For now, we'll just show a message
                alert('Google OAuth integration would redirect to Google here');
              }}
              className="w-full flex justify-center items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-yellow-50 font-semibold rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Continue with Google
            </button>
          </div>
          <div className="mt-6">
            <p className="text-sm text-yellow-300">
              Or sign in with email
              <a 
                href="/login"
                className="font-medium text-yellow-200 hover:text-yellow-100 transition-colors"
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuth;