import { useEffect, useState } from 'react';
import { ModerationService } from '../services/ModerationService';
import { Report } from '../types';
import { AlertCircle, CheckCircle, ShieldAlert, Ban, AlertTriangle, ShieldCheck, Activity, Clock } from 'lucide-react';

export default function ModerationDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingReports();
  }, []);

  const fetchPendingReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ModerationService.getPendingReports();
      setReports(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading reports.');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (reportId: string, userId: string) => {
    try {
      if (!window.confirm('Are you certain you want to ban this user? This action is permanent.')) return;
      setActionLoadingId(reportId);

      const reason = window.prompt('Provide a reason for the ban:', 'Violation of community guidelines');
      if (!reason) {
        setActionLoadingId(null);
        return;
      }

      await ModerationService.suspendUser(userId, reportId, reason);
      setReports((prev) => prev.filter((r) => r.id !== reportId));

      // Simulate toast
      alert('Success: User banned and report closed.');
    } catch (err: any) {
      alert(`Ban failed: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleResolveReport = async (reportId: string) => {
    try {
      if (!window.confirm('Discard this report safely without any actions?')) return;
      setActionLoadingId(reportId);

      // Since resolve isolated isn't fully linked to DB mock, we optimistically filter
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (err: any) {
      alert(`Resolve failed: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Simulated widget metrics for radical design
  const totalReportsMock = reports.length + 152;
  const pendingReports = reports.length;
  const reviewingReportsMock = 12;
  const resolvedReportsMock = 140;

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-10 h-10 text-purple-600 dark:text-purple-500" />
            Moderation & Reports
          </h1>
          <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
            There are currently <span className="font-bold text-red-600 dark:text-red-400">{pendingReports}</span> reports pending review out of {totalReportsMock} total reports.
          </p>
        </div>
      </header>

      {/* Radical Top Widget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Reports */}
        <div className="bg-white dark:bg-[#1A1A24] rounded-2xl shadow-xl shadow-purple-900/5 dark:shadow-none border border-gray-100 dark:border-gray-800 p-6 flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Reports</p>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{totalReportsMock}</h3>
          </div>
        </div>

        {/* Pending Reports */}
        <div className="bg-white dark:bg-[#1A1A24] rounded-2xl shadow-xl shadow-red-900/5 dark:shadow-none border border-gray-100 dark:border-gray-800 p-6 flex items-center gap-4 transition-transform hover:-translate-y-1 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertTriangle className="w-32 h-32 text-red-500" />
          </div>
          <div className="relative z-10 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Pending</p>
            <h3 className="text-3xl font-black text-red-600 dark:text-red-400 mt-1">{pendingReports}</h3>
          </div>
        </div>

        {/* Reviewing Reports */}
        <div className="bg-white dark:bg-[#1A1A24] rounded-2xl shadow-xl shadow-blue-900/5 dark:shadow-none border border-gray-100 dark:border-gray-800 p-6 flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Reviewing</p>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{reviewingReportsMock}</h3>
          </div>
        </div>

        {/* Resolved Reports */}
        <div className="bg-white dark:bg-[#1A1A24] rounded-2xl shadow-xl shadow-emerald-900/5 dark:shadow-none border border-gray-100 dark:border-gray-800 p-6 flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Resolved</p>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{resolvedReportsMock}</h3>
          </div>
        </div>
      </div>

      {/* Reports Table Card */}
      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-red-800 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" /> Critical Error
          </h3>
          <p className="mt-2 text-red-700 dark:text-red-300 font-medium">{error}</p>
          <button onClick={fetchPendingReports} className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/80 transition-colors font-bold text-sm">Retry Connection</button>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1A1A24] rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden">

          <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-transparent flex justify-between items-center">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Pending Action Items</h2>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-32 space-y-4">
              <div className="w-12 h-12 border-4 border-purple-200 dark:border-gray-800 border-t-purple-600 dark:border-t-purple-500 rounded-full animate-spin"></div>
              <p className="text-gray-500 dark:text-gray-400 font-bold tracking-widest uppercase text-sm animate-pulse">Fetching Reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-32 text-center px-4">
              <div className="w-24 h-24 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-emerald-500 dark:text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Queue is Empty</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm text-lg">There are no pending reports to review. The platform is secure.</p>
              <button onClick={fetchPendingReports} className="mt-8 px-8 py-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                Refresh Queue
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="px-8 py-5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest w-1/4">REPORTED USER</th>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest w-1/4">REASON & TYPE</th>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest w-1/6">DATE</th>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest w-1/6">STATUS</th>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">

                      {/* Avatar & User Details */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img
                            className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 border-2 border-white dark:border-gray-800 shadow-sm"
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${report.target_id}`}
                            alt="Avatar"
                          />
                          <div>
                            <div className="text-base font-extrabold text-gray-900 dark:text-white">
                              User_{report.target_id.substring(0, 4)}
                            </div>
                            <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                              @{report.target_id.substring(0, 8)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Reason & Type */}
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-1 max-w-[220px] truncate" title={report.description}>
                          {report.description || 'Inappropriate Content Guidelines Violation'}
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          {report.target_type}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-gray-900 dark:text-gray-200">
                          {new Date(report.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {new Date(report.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                          {report.status || 'PENDING'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-6 text-right space-x-3">
                        {report.target_type === 'USER' ? (
                          <div className="flex items-center justify-end gap-3">
                            {/* Ban User (Red, Solid) */}
                            <button
                              onClick={() => handleBanUser(report.id, report.target_id)}
                              disabled={actionLoadingId === report.id}
                              className="inline-flex items-center justify-center px-4 py-2.5 bg-red-600 dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-500/20 dark:shadow-none transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                            >
                              {actionLoadingId === report.id ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <>
                                  <Ban className="w-4 h-4 mr-2" />
                                  Ban User
                                </>
                              )}
                            </button>

                            {/* Resolve Report (Indigo, Solid) */}
                            <button
                              onClick={() => handleResolveReport(report.id)}
                              disabled={actionLoadingId === report.id}
                              className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 dark:bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 dark:shadow-none transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Resolve Report
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600 font-bold text-sm tracking-wide">NOT USER TARGET</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
