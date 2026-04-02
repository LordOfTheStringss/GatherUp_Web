import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalyticsEngine, UserGrowthMetrics, PopularCategory } from '../services/AnalyticsEngine';
import { ModerationService } from '../services/ModerationService';
import { User } from '../types';
import { Users, AlertCircle, PieChart as PieChartIcon, Activity, UserPlus, Ban, X, Shield, ShieldOff, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type ActiveView = 'total' | 'new' | 'banned' | null;

export default function MainDashboard() {
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState<UserGrowthMetrics | null>(null);
  const [pendingReportsCount, setPendingReportsCount] = useState<number>(0);
  const [popularCategories, setPopularCategories] = useState<PopularCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Command Center state
  const [activeView, setActiveView] = useState<ActiveView>(null);
  const [viewUsers, setViewUsers] = useState<User[]>([]);
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [viewError, setViewError] = useState<string | null>(null);

  // Ban modal state
  const [banModalUserId, setBanModalUserId] = useState<string | null>(null);
  const [banReason, setBanReason] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [metricsData, reportsData, categoriesData] = await Promise.all([
        AnalyticsEngine.getUserGrowthMetrics(),
        ModerationService.getPendingReports(),
        AnalyticsEngine.getPopularCategories()
      ]);

      setMetrics(metricsData);
      setPendingReportsCount(reportsData.length);
      const sortedCategories = categoriesData.sort((a, b) => b.count - a.count);
      setPopularCategories(sortedCategories);

    } catch (err: any) {
      console.error(err);
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchViewUsers = useCallback(async (view: 'total' | 'new' | 'banned') => {
    setViewLoading(true);
    setViewError(null);
    setViewUsers([]);
    try {
      let users: User[] = [];
      switch (view) {
        case 'total':
          users = await AnalyticsEngine.getAllUsers();
          break;
        case 'new':
          users = await AnalyticsEngine.getRecentUsers();
          break;
        case 'banned':
          users = await AnalyticsEngine.getBannedUsers();
          break;
      }
      setViewUsers(users);
    } catch (err: any) {
      console.error('Fetch Users Error:', { view, error: err, message: err?.message });
      setViewError(`Failed to load user list: ${err?.message || 'Unknown error'}`);
    } finally {
      setViewLoading(false);
    }
  }, []);

  const handleWidgetClick = (view: 'total' | 'new' | 'banned') => {
    if (activeView === view) {
      setActiveView(null);
      return;
    }
    setActiveView(view);
    fetchViewUsers(view);
  };

  const handleBanUser = async (userId: string) => {
    if (!banReason.trim()) return;
    setActionLoading(userId);
    try {
      await ModerationService.banUserDirectly(userId, banReason.trim());

      // Instant local state update — flip status to BANNED in the list
      setViewUsers((prev) =>
        activeView === 'banned'
          ? prev // already in banned view, user will appear on re-fetch
          : prev.map((u) => (u.id === userId ? { ...u, status: 'BANNED' as const } : u))
      );

      // Close modal & clear reason
      setBanModalUserId(null);
      setBanReason('');

      // Refresh metrics in background (non-blocking)
      fetchDashboardData();
    } catch (err) {
      console.error('Ban failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      await ModerationService.unbanUser(userId);

      // Instant local state update
      if (activeView === 'banned') {
        // Remove from the banned list since they're no longer banned
        setViewUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        // Flip status to ACTIVE in the list
        setViewUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: 'ACTIVE' as const } : u))
        );
      }

      // Refresh metrics in background (non-blocking)
      fetchDashboardData();
    } catch (err) {
      console.error('Unban failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'total': return 'All Users';
      case 'new': return 'New Signups (Last 7 Days)';
      case 'banned': return 'Banned Users';
      default: return '';
    }
  };

  const COLORS = ['#8B5CF6', '#6366F1', '#EC4899', '#14B8A6', '#F59E0B', '#3B82F6'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-xl text-red-700 dark:text-red-400 transition-colors">
        <p className="font-medium text-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> Error
        </p>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="mt-3 underline text-sm hover:text-red-900 dark:hover:text-red-300">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="pb-5 border-b border-gray-200 dark:border-gray-800/60 transition-colors">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <Activity className="w-8 h-8 text-purple-600 dark:text-purple-500" />
          Command Center
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Click any metric to drill into the data. Take direct moderation actions.
        </p>
      </header>

      {/* Analytics Widget Cards - 4 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Users Widget (Blue) */}
        <div
          id="widget-total-users"
          onClick={() => handleWidgetClick('total')}
          className={`bg-white dark:bg-[#1A1A24] rounded-2xl shadow-sm border p-6 flex items-start cursor-pointer select-none hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 relative overflow-hidden group ${
            activeView === 'total'
              ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-blue-500/10 dark:border-blue-400 dark:ring-blue-400/20'
              : 'border-gray-100 dark:border-gray-800/60'
          }`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="w-24 h-24 text-blue-500" />
          </div>
          <div className={`p-3 rounded-xl relative z-10 transition-colors ${
            activeView === 'total'
              ? 'bg-blue-500 text-white'
              : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
          }`}>
            <Users className="w-6 h-6" />
          </div>
          <div className="ml-4 relative z-10">
            <p className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase">TOTAL USERS</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{metrics?.totalUsers.toLocaleString()}</h3>
          </div>
        </div>

        {/* New Signups Widget (Purple) */}
        <div
          id="widget-new-signups"
          onClick={() => handleWidgetClick('new')}
          className={`bg-white dark:bg-[#1A1A24] rounded-2xl shadow-sm border p-6 flex items-start cursor-pointer select-none hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 relative overflow-hidden group ${
            activeView === 'new'
              ? 'border-purple-500 ring-2 ring-purple-500/30 shadow-purple-500/10 dark:border-purple-400 dark:ring-purple-400/20'
              : 'border-gray-100 dark:border-gray-800/60'
          }`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <UserPlus className="w-24 h-24 text-purple-500" />
          </div>
          <div className={`p-3 rounded-xl relative z-10 transition-colors ${
            activeView === 'new'
              ? 'bg-purple-500 text-white'
              : 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
          }`}>
            <UserPlus className="w-6 h-6" />
          </div>
          <div className="ml-4 relative z-10">
            <p className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase">NEW SIGNUPS (7D)</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">+{metrics?.newRegistrationsThisWeek.toLocaleString()}</h3>
          </div>
        </div>

        {/* Pending Reports Widget (Red - navigates to Moderation) */}
        <div
          id="widget-pending-reports"
          onClick={() => navigate('/admin/moderation')}
          className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-800 rounded-2xl shadow-lg shadow-red-500/30 border border-red-400 dark:border-red-700/50 p-6 flex items-start hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
            <AlertCircle className="w-24 h-24 text-white" />
          </div>
          <div className="p-3 bg-white/20 text-white rounded-xl relative z-10 backdrop-blur-sm">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="ml-4 relative z-10">
            <p className="text-xs font-bold tracking-wider text-red-100 uppercase">PENDING REPORTS</p>
            <h3 className="text-2xl font-black text-white mt-1">{pendingReportsCount}</h3>
          </div>
        </div>

        {/* Banned Users Widget (Orange) */}
        <div
          id="widget-banned-users"
          onClick={() => handleWidgetClick('banned')}
          className={`bg-white dark:bg-[#1A1A24] rounded-2xl shadow-sm border p-6 flex items-start cursor-pointer select-none hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 relative overflow-hidden group ${
            activeView === 'banned'
              ? 'border-orange-500 ring-2 ring-orange-500/30 shadow-orange-500/10 dark:border-orange-400 dark:ring-orange-400/20'
              : 'border-gray-100 dark:border-gray-800/60'
          }`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Ban className="w-24 h-24 text-orange-500" />
          </div>
          <div className={`p-3 rounded-xl relative z-10 transition-colors ${
            activeView === 'banned'
              ? 'bg-orange-500 text-white'
              : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
          }`}>
            <Ban className="w-6 h-6" />
          </div>
          <div className="ml-4 relative z-10">
            <p className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase">BANNED USERS</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{metrics?.bannedUsers.toLocaleString()}</h3>
          </div>
        </div>

      </div>

      {/* Inline User Management Table */}
      {activeView !== null && (
        <div className="bg-white dark:bg-[#1A1A24] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 overflow-hidden transition-all duration-300 animate-in">
          {/* Table Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800/60">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                activeView === 'total' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                activeView === 'new' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
              }`}>
                {activeView === 'total' && <Users className="w-5 h-5" />}
                {activeView === 'new' && <UserPlus className="w-5 h-5" />}
                {activeView === 'banned' && <Ban className="w-5 h-5" />}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{getViewTitle()}</h3>
              {!viewLoading && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  {viewUsers.length} users
                </span>
              )}
            </div>
            <button
              id="close-user-table"
              onClick={() => setActiveView(null)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Loading Skeleton */}
          {viewLoading && (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/4"></div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {viewError && !viewLoading && (
            <div className="p-6 text-center">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-500 dark:text-red-400">{viewError}</p>
              <button
                onClick={() => activeView && fetchViewUsers(activeView)}
                className="mt-2 text-sm underline text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Retry
              </button>
            </div>
          )}

          {/* Data Table */}
          {!viewLoading && !viewError && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800/60">
                    <th className="text-left px-6 py-3 text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase">User Info</th>
                    <th className="text-left px-6 py-3 text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase">Join Date</th>
                    <th className="text-left px-6 py-3 text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase">Status</th>

                    <th className="text-right px-6 py-3 text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/40">
                  {viewUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    viewUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        {/* User Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt={user.full_name}
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm ring-2 ring-gray-100 dark:ring-gray-700">
                                {(user.full_name || user.email || '?').charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.full_name || '—'}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Join Date */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                            user.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : user.status === 'BANNED'
                              ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'ACTIVE' ? 'bg-emerald-500' :
                              user.status === 'BANNED' ? 'bg-red-500' : 'bg-amber-500'
                            }`}></span>
                            {user.status}
                          </span>
                        </td>



                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          {user.status === 'ACTIVE' || user.status === 'BUSY' ? (
                            <button
                              id={`ban-user-${user.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setBanModalUserId(user.id);
                              }}
                              disabled={actionLoading === user.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === user.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Shield className="w-3.5 h-3.5" />
                              )}
                              Ban User
                            </button>
                          ) : (
                            <button
                              id={`unban-user-${user.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnbanUser(user.id);
                              }}
                              disabled={actionLoading === user.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === user.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <ShieldOff className="w-3.5 h-3.5" />
                              )}
                              Unban User
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Ban Confirmation Modal */}
      {banModalUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => { setBanModalUserId(null); setBanReason(''); }}>
          <div
            className="bg-white dark:bg-[#1A1A24] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ban User</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              This action will immediately restrict the user's access. Please provide a reason for the ban.
            </p>
            <textarea
              id="ban-reason-input"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Enter ban reason..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 resize-none text-sm transition-colors"
            />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => { setBanModalUserId(null); setBanReason(''); }}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                id="confirm-ban-button"
                onClick={() => handleBanUser(banModalUserId)}
                disabled={!banReason.trim() || actionLoading === banModalUserId}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {actionLoading === banModalUserId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Shield className="w-4 h-4" />
                )}
                Confirm Ban
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chart Section */}
      <div className="bg-white dark:bg-[#1A1A24] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 p-6 transition-colors duration-300">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <PieChartIcon className="w-5 h-5 text-purple-500" />
          Event Categories
        </h3>

        {popularCategories.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">Not enough data to display.</div>
        ) : (
          <div className="h-[400px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={popularCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={110}
                  outerRadius={150}
                  paddingAngle={3}
                  dataKey="count"
                  stroke="none"
                >
                  {popularCategories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ outline: 'none' }} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} Events`, name]}
                  contentStyle={{ backgroundColor: '#1A1A24', color: '#fff', border: '1px solid #374151', borderRadius: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  );
}
