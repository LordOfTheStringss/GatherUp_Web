import { useEffect, useState } from 'react';
import { AnalyticsEngine, UserGrowthMetrics, PopularCategory } from '../services/AnalyticsEngine';
import { ModerationService } from '../services/ModerationService';
import { Users, AlertCircle, PieChart as PieChartIcon, Activity, UserPlus, Ban } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MainDashboard() {
  const [metrics, setMetrics] = useState<UserGrowthMetrics | null>(null);
  const [pendingReportsCount, setPendingReportsCount] = useState<number>(0);
  const [popularCategories, setPopularCategories] = useState<PopularCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      setPopularCategories(categoriesData);

    } catch (err: any) {
      console.error(err);
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#6366f1'];

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
          <AlertCircle className="w-5 h-5"/> Error
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
          Dashboard Overview
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Track platform performance and current data.
        </p>
      </header>

      {/* Analytics Widget Cards - 4 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Users Widget (Blue) */}
        <div className="bg-white dark:bg-[#1A1A24] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 p-6 flex items-start hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="w-24 h-24 text-blue-500" />
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl relative z-10">
            <Users className="w-6 h-6" />
          </div>
          <div className="ml-4 relative z-10">
            <p className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase">TOTAL USERS</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{metrics?.totalUsers.toLocaleString()}</h3>
          </div>
        </div>

        {/* New Signups Widget (Purple) */}
        <div className="bg-white dark:bg-[#1A1A24] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 p-6 flex items-start hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <UserPlus className="w-24 h-24 text-purple-500" />
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl relative z-10">
            <UserPlus className="w-6 h-6" />
          </div>
          <div className="ml-4 relative z-10">
            <p className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase">NEW SIGNUPS (7D)</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">+{metrics?.newRegistrationsThisWeek.toLocaleString()}</h3>
          </div>
        </div>

        {/* Pending Reports Widget (Red popping warning) */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-800 rounded-2xl shadow-lg shadow-red-500/30 border border-red-400 dark:border-red-700/50 p-6 flex items-start hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden group cursor-pointer">
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
        <div className="bg-white dark:bg-[#1A1A24] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 p-6 flex items-start hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Ban className="w-24 h-24 text-orange-500" />
          </div>
          <div className="p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl relative z-10">
            <Ban className="w-6 h-6" />
          </div>
          <div className="ml-4 relative z-10">
            <p className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase">BANNED USERS</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{metrics?.bannedUsers.toLocaleString()}</h3>
          </div>
        </div>

      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-[#1A1A24] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 p-6 mt-6 transition-colors duration-300">
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
