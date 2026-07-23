import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from './pages/signUp.jsx';
import LoginPage from './pages/login.jsx';
import VerifyEmailPage from './pages/verifyEmail.jsx';
import ForgotPasswordPage from './pages/forgotPassword.jsx';
import ResetPasswordPage from './pages/resetPassword.jsx';
import DashboardPage from './pages/dashboard/index.jsx';

function App() { 
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-red-950 to-red-900">
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verifyEmail" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
