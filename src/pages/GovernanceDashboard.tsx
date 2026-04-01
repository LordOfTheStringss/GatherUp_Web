import React, { useEffect, useState } from 'react';
import { GovernanceService } from '../services/GovernanceService';
import { AllowedDomain } from '../types';
import { ShieldCheck, Plus, Globe, Users, Trash2, AlertCircle, Search } from 'lucide-react';

export default function GovernanceDashboard() {
  const [domains, setDomains] = useState<AllowedDomain[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [newDomain, setNewDomain] = useState<string>('');
  const [addError, setAddError] = useState<string | null>(null);

  const [auditingDomain, setAuditingDomain] = useState<string | null>(null);
  const [auditResults, setAuditResults] = useState<any[] | null>(null);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GovernanceService.getAllDomains();
      setDomains(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load domains');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    try {
      setActionLoading(true);
      const added = await GovernanceService.addDomain(newDomain);
      setDomains((prev) => [added, ...prev]);
      setNewDomain('');
    } catch (error: any) {
      setAddError(error.message || 'Failed to add domain');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveDomain = async (domainObj: AllowedDomain) => {
    if (!window.confirm(`Are you sure you want to remove '${domainObj.domain}' from the whitelist?`)) return;
    
    try {
      setActionLoading(true);
      await GovernanceService.removeDomain(domainObj.domain);
      setDomains((prev) => prev.filter((d) => d.id !== domainObj.id));
      if (auditingDomain === domainObj.domain) {
        setAuditResults(null);
        setAuditingDomain(null);
      }
    } catch (error: any) {
      alert(`Removal failed: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAudit = async (domain: string) => {
    try {
      setAuditingDomain(domain);
      setAuditResults(null); 
      const results = await GovernanceService.auditDomainRegistration(domain);
      setAuditResults(results);
    } catch (err: any) {
      alert(`Audit Error: ${err.message}`);
      setAuditingDomain(null);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6 animate-fade-in">
      
      {/* Header */}
      <header className="flex-none">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <ShieldCheck className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          Governance Control
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Manage allowed institutional domains for secure platform registration.
        </p>
      </header>

      {/* Main Split View: Left (Domains), Right (Audit) */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-8 min-h-0">
        
        {/* Card 1: Domain Management */}
        <div className="bg-white dark:bg-[#1A1A24] rounded-3xl shadow-2xl shadow-gray-200/40 dark:shadow-none border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden transition-colors">
          <div className="p-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-transparent">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Domain Management</h2>
            
            <form onSubmit={handleAddDomain} className="flex items-start gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="e.g., mit.edu"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-[#23232F] text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-gray-700/80 focus:bg-white dark:focus:bg-[#2A2A38] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-base font-medium transition-all outline-none"
                  disabled={actionLoading}
                />
                {addError && <p className="mt-3 text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> {addError}</p>}
              </div>
              <button
                type="submit"
                disabled={actionLoading || !newDomain.trim()}
                className="inline-flex justify-center items-center py-4 px-8 border border-transparent text-base font-bold rounded-2xl text-white bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Domain
              </button>
            </form>
          </div>

          <div className="flex-1 overflow-y-auto bg-white dark:bg-[#1A1A24]">
            {error ? (
              <div className="p-10 text-center text-red-500 dark:text-red-400">
                <AlertCircle className="w-10 h-10 mx-auto mb-3" />
                <p className="text-lg font-bold">{error}</p>
                <button onClick={fetchDomains} className="mt-4 font-bold px-6 py-2.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full hover:bg-red-200 transition-colors">Retry</button>
              </div>
            ) : loading ? (
              <div className="p-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Loading Domains...</p>
              </div>
            ) : domains.length === 0 ? (
              <div className="p-20 text-center text-gray-500 dark:text-gray-400">
                <Globe className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-xl font-bold text-gray-900 dark:text-white">No Domains Configured</p>
                <p className="mt-2 text-base">Add an institutional domain above to get started.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {domains.map((d) => (
                  <li key={d.id} className="group p-6 hover:bg-gray-50 dark:hover:bg-white/[0.02] flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center border border-purple-100 dark:border-purple-800/50">
                        <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-gray-900 dark:text-white tracking-wide">{d.domain}</p>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                          Added {new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleAudit(d.domain)}
                        className={`text-sm font-bold px-5 py-2.5 rounded-xl transition-colors ${auditingDomain === d.domain ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/40 hover:text-purple-700 dark:hover:text-purple-300'}`}
                      >
                        Audit Users
                      </button>
                      <button
                        onClick={() => handleRemoveDomain(d)}
                        disabled={actionLoading}
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors disabled:opacity-50"
                        title="Delete Domain"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Card 2: Audit Panel */}
        <div className="bg-white dark:bg-[#1A1A24] rounded-3xl shadow-2xl shadow-gray-200/40 dark:shadow-none border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden transition-colors">
          <div className="p-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-transparent">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <Users className="w-7 h-7 text-purple-500" />
              {auditingDomain ? `Audit Results: [${auditingDomain}]` : 'Audit Panel'}
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {!auditingDomain ? (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select a Domain</h3>
                <p className="text-base text-gray-500 dark:text-gray-400 max-w-sm">
                  Click 'Audit Users' on any domain from the management list to inspect its registered user base.
                </p>
              </div>
            ) : !auditResults ? (
              <div className="flex flex-col justify-center items-center py-32 space-y-4">
                <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <p className="text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest text-sm animate-pulse">Scanning Registry...</p>
              </div>
            ) : auditResults.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-6">
                  <AlertCircle className="w-10 h-10 text-amber-500 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Users Found</h3>
                <p className="text-base text-gray-500 dark:text-gray-400 max-w-sm">
                  There are currently no users registered under the <span className="font-bold text-gray-900 dark:text-white">{auditingDomain}</span> domain.
                </p>
              </div>
            ) : (
              <div>
                <div className="px-8 py-4 bg-purple-50/50 dark:bg-purple-900/10 border-b border-purple-100 dark:border-purple-900/30">
                  <p className="text-sm font-bold text-purple-700 dark:text-purple-400">
                    Showing {auditResults.length} registered users
                  </p>
                </div>
                <ul className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {auditResults.map((u) => (
                    <li key={u.id} className="p-6 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] flex items-center justify-between transition-colors">
                      <div className="flex items-center gap-4">
                        <img 
                          className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 border-2 border-white dark:border-gray-800 shadow-sm" 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} 
                          alt="Avatar" 
                        />
                        <div>
                          <p className="text-base font-extrabold text-gray-900 dark:text-white truncate max-w-[200px]" title={u.full_name}>{u.full_name}</p>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate max-w-[200px]" title={u.email}>{u.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${u.status === 'BANNED' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'}`}>
                          {u.status}
                        </span>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          Rep: <span className="text-gray-900 dark:text-white">{u.reputation_score}</span>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
