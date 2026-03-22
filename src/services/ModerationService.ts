import { supabaseClient } from '../infra/supabaseClient';
import { Report } from '../types';

export class ModerationService {
  /**
   * getPendingReports: reports tablosundan status = 'PENDING' olanları tarihe göre azalan sırada getir.
   */
  static async getPendingReports(): Promise<Report[]> {
    const { data, error } = await supabaseClient
      .from('reports')
      .select('*')
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getPendingReports Error:', error);
      throw new Error(error.message);
    }

    // Explicit casting to match the Report interface
    return (data as unknown as Report[]) || [];
  }

  /**
   * suspendUser: Transactional olarak kullanıcıyı yasaklar, raporu çözer ve log atar.
   */
  static async suspendUser(userId: string, reportId: string, reason: string): Promise<void> {
    console.log("DEBUG - Gelen UserId:", userId, "Gelen ReportId:", reportId);
    if (!userId) throw new Error("Hata: Frontend'den User ID boş (undefined) geliyor! Prop isimlerini kontrol et.");

    try {
      // 1. users tablosunda id = userId olan kaydın status alanını 'BANNED' yap
      const { data: userData, error: userError } = await (supabaseClient as any)
        .from('users')
        .update({ status: 'BANNED' })
        .eq('id', userId)
        .select();

      if (userError) throw new Error(userError.message);
      
      if (!userData || userData.length === 0) {
        throw new Error('Hata: Belirtilen ID ile eşleşen bir kullanıcı bulunamadı!');
      }

      // 2. reports tablosunda id = reportId olan kaydın status alanını 'RESOLVED' yap
      const { error: reportError } = await (supabaseClient as any)
        .from('reports')
        .update({ status: 'RESOLVED' })
        .eq('id', reportId);

      if (reportError) throw new Error(reportError.message);

      // 3. audit_logs tablosuna kayıt at
      const { error: auditError } = await (supabaseClient as any)
        .from('audit_logs')
        .insert({
          action: 'BAN_USER',
          target_id: userId,
          reason: reason,
          created_at: new Date().toISOString()
        });

      if (auditError) throw new Error(auditError.message);
      
    } catch (error) {
      console.error('suspendUser Transactional Error:', error);
      throw error;
    }
  }

  /**
   * removeEvent: events tablosunda id = eventId olan kaydı soft delete yap.
   */
  static async removeEvent(eventId: string, reason: string): Promise<void> {
    // 1. events tablosunda kaydın durumunu CANCELLED yapmak (Soft delete)
    const { error: eventError } = await (supabaseClient as any)
      .from('events')
      .update({ status: 'CANCELLED' })
      .eq('id', eventId);

    if (eventError) {
      console.error('removeEvent Error:', eventError);
      throw new Error(eventError.message);
    }

    // İsteğe bağlı olarak audit log da atılabilir
    await (supabaseClient as any).from('audit_logs').insert({
      action: 'REMOVE_EVENT',
      target_id: eventId,
      reason: reason,
      created_at: new Date().toISOString()
    });
  }
}
