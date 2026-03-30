import { useState, useEffect } from 'react';
import { supabaseClient as SupabaseClient } from '../../infra/supabase';
import { Report } from '../moderation/Report';

export interface DashboardDTO {
  activeUserCount: number;
  pendingReports: Report[];
}

export function useDashboard() {
  const [data, setData] = useState<DashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        // Parallel Fetch
        const [userCountRes, reportsRes] = await Promise.all([
          SupabaseClient.from('users').select('*', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
          SupabaseClient.from('reports').select('*').eq('status', 'PENDING')
        ]);

        setData({
          activeUserCount: userCountRes.count || 0,
          pendingReports: reportsRes.data as unknown as Report[] || []
        });
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  return { data, loading };
}
