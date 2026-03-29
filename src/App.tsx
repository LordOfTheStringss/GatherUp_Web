import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import { ThemeProvider } from './components/ThemeProvider';

// Dashboard Views
import MainDashboard from './pages/MainDashboard';
import ModerationDashboard from './pages/ModerationDashboard';
import GovernanceDashboard from './pages/GovernanceDashboard';
import SystemHealthDashboard from './pages/SystemHealthDashboard';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            {/* Redirect /admin directly to /admin/overview */}
            <Route index element={<Navigate to="/admin/overview" replace />} />
            
            <Route path="overview" element={<MainDashboard />} />
            <Route path="moderation" element={<ModerationDashboard />} />
            <Route path="governance" element={<GovernanceDashboard />} />
            <Route path="health" element={<SystemHealthDashboard />} />
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
