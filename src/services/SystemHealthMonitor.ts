import { supabaseClient } from '../infra/supabase';

export type ServiceStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL';

export interface ServiceQuota {
  name: string;
  limit: number;
  used: number;
  percentage: number;
  status: ServiceStatus;
}

export class SystemHealthMonitor {
  /**
   * Servis kotalarını kontrol edip durum raporu döner (Gerçek Supabase verisiyle)
   */
  static async checkServiceStatus(): Promise<ServiceQuota[]> {
    const limit = 500; // 500 MB (Supabase Free Tier)
    let used = 0;

    try {
      const { data, error } = await supabaseClient.rpc('get_database_size');
      if (error) {
        console.error('get_database_size RPC hatası:', error.message);
      } else if (typeof data === 'number') {
        used = data;
      }
    } catch (err: any) {
      console.error('get_database_size catch hatası:', err.message || err);
    }

    const percentage = (used / limit) * 100;
    let status: ServiceStatus = 'HEALTHY';

    if (percentage >= 95) {
      status = 'CRITICAL';
    } else if (percentage >= 80) {
      status = 'WARNING';
    }

    return [{
      name: 'Supabase Database',
      limit,
      used: Number(used.toFixed(2)),
      percentage: Number(percentage.toFixed(2)),
      status
    }];
  }
}
