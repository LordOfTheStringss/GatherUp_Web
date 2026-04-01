import { useEffect, useState } from 'react';
import { SystemHealthMonitor, ServiceQuota } from '../services/SystemHealthMonitor';
import { Activity, ServerCrash, AlertTriangle, CheckCircle, Database } from 'lucide-react';

export default function SystemHealthDashboard() {
  const [quotas, setQuotas] = useState<ServiceQuota[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotas();
  }, []);

  const fetchQuotas = async () => {
    try {
      setLoading(true);
      const data = await SystemHealthMonitor.checkServiceStatus();
      setQuotas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CRITICAL': return 'bg-gradient-to-r from-red-500 to-red-600';
      case 'WARNING': return 'bg-gradient-to-r from-amber-400 to-amber-500';
      default: return 'bg-gradient-to-r from-emerald-400 to-emerald-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CRITICAL': return <ServerCrash className="w-8 h-8 text-red-500" />;
      case 'WARNING': return <AlertTriangle className="w-8 h-8 text-amber-500" />;
      default: return <CheckCircle className="w-8 h-8 text-emerald-500" />;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'CRITICAL': return 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30';
      case 'WARNING': return 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30';
      default: return 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="pb-6 border-b border-gray-100 dark:border-gray-800/60 transition-colors">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <Database className="w-10 h-10 text-purple-600 dark:text-purple-500" />
          System Health & Quotas
        </h1>
        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
          Monitor external and internal API usage quotas under the Zero Budget policy.
        </p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-32 space-y-4">
           <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
           <p className="font-bold tracking-widest text-sm text-gray-400 uppercase">Analyzing Systems...</p>
        </div>
      ) : quotas.length === 0 ? (
        <div className="p-20 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1A1A24] rounded-3xl border border-gray-100 dark:border-gray-800">
          <Activity className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-xl font-bold text-gray-900 dark:text-white">No active services monitored</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {quotas.map((q) => (
            <div key={q.name} className={`relative overflow-hidden rounded-3xl border p-8 flex flex-col shadow-2xl shadow-gray-200/40 dark:shadow-none hover:-translate-y-1 transition-all duration-300 ${getStatusBgColor(q.status)}`}>
              
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                {getStatusIcon(q.status)}
              </div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">{q.name}</h3>
                  <div className="inline-flex mt-2 px-3 py-1 rounded-full bg-white/60 dark:bg-black/20 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 backdrop-blur-sm border border-black/5 dark:border-white/5">
                    Storage Node
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-[#1A1A24] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/80">
                  {getStatusIcon(q.status)}
                </div>
              </div>

              <div className="mt-auto pt-6">
                
                <div className="flex justify-between items-end mb-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">DATA USAGE</span>
                    <span className="text-lg font-black text-gray-900 dark:text-white">
                      {q.used.toLocaleString()} <span className="text-base font-medium text-gray-500">MB / {q.limit.toLocaleString()} MB</span>
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">CAPACITY</span>
                    <span className={`text-2xl font-black ${q.status === 'CRITICAL' ? 'text-red-600 dark:text-red-400' : q.status === 'WARNING' ? 'text-amber-600 dark:text-amber-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {q.percentage}%
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar Background */}
                <div className="w-full bg-white/50 dark:bg-black/40 rounded-full h-4 mb-3 overflow-hidden shadow-inner border border-black/5 dark:border-white/5">
                  {/* Progress Bar Fill */}
                  <div 
                    className={`h-4 rounded-full transition-all duration-1000 ease-out ${getStatusColor(q.status)} shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]`}
                    style={{ width: `${Math.min(q.percentage, 100)}%` }}
                  ></div>
                </div>

                {/* Status Message */}
                <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5">
                  <p className="text-sm font-bold flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    {q.status === 'CRITICAL' 
                      ? <><ServerCrash className="w-4 h-4 text-red-500"/> Critical limit reached! Operations may halt.</>
                      : q.status === 'WARNING' 
                      ? <><AlertTriangle className="w-4 h-4 text-amber-500"/> Warning: 80% usage reached, quota is filling up.</>
                      : <><CheckCircle className="w-4 h-4 text-emerald-500"/> Healthy: Operating within normal quota limits.</>}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
