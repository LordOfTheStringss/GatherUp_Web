import React from 'react';
import { useDashboard } from './DashboardHook';

export default function Dashboard() {
  const { data, loading } = useDashboard();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-500 animate-pulse">Loading Dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Panel Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Active Users</h2>
          <p className="text-4xl font-extrabold text-indigo-600 mt-2">{data?.activeUserCount.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pending Reports</h2>
          <p className="text-4xl font-extrabold text-amber-600 mt-2">{data?.pendingReports.length || 0}</p>
        </div>
      </div>
    </div>
  );
}
