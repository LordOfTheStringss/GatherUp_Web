import { supabaseClient as SupabaseClient } from '../../infra/supabase';

export class BanWorkflow {
  async execute(userId: string, reportId: string): Promise<void> {
    try {
      // 1. Set user status to BANNED
      await (SupabaseClient as any).from('users').update({ status: 'BANNED' }).eq('id', userId);

      // 2. Set report status to RESOLVED
      await (SupabaseClient as any).from('reports').update({ status: 'RESOLVED' }).eq('id', reportId);

      // 3. Insert audit log
      await (SupabaseClient as any).from('audit_logs').insert({
        action: 'BAN_USER',
        target_id: userId,
        report_id: reportId,
        created_at: new Date().toISOString()
      });

    } catch (error) {
      console.error('Transactional error in BanWorkflow', error);
      throw new Error('BanWorkflow Transaction Failed');
    }
  }
}
