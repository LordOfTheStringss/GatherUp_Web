import { supabaseClient } from '../infra/supabase';

export interface UserGrowthMetrics {
  totalUsers: number;
  newRegistrationsThisWeek: number;
  bannedUsers: number;
}

export interface PopularCategory {
  name: string;
  count: number;
}

export class AnalyticsEngine {
  /**
   * users tablosundan toplam kullanıcı sayısını ve son 7 günde kayıt olanlarını hesaplar.
   */
  static async getUserGrowthMetrics(): Promise<UserGrowthMetrics> {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Toplam kullanıcı
    const { count: totalCount, error: totalError } = await supabaseClient
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (totalError) {
      console.error('getUserGrowthMetrics - totalCount error:', totalError);
      throw new Error('Toplam kullanıcı hesaplanamadı.');
    }

    // Son 7 günde kayıt olanlar
    const { count: newCount, error: newError } = await supabaseClient
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    if (newError) {
      console.error('getUserGrowthMetrics - newCount error:', newError);
      throw new Error('Yeni kayıtlar hesaplanamadı.');
    }

    // Yasaklı Kullanıcılar
    const { count: bannedCount, error: bannedError } = await supabaseClient
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'BANNED');

    if (bannedError) {
      console.error('getUserGrowthMetrics - bannedCount error:', bannedError);
      throw new Error(bannedError.message);
    }

    return {
      totalUsers: totalCount || 0,
      newRegistrationsThisWeek: newCount || 0,
      bannedUsers: bannedCount || 0
    };
  }

  /**
   * events tablosundaki category alanına göre gruplandırıp sayar.
   * RPC mevcut olmadığı varsayımıyla, sadece kategori adlarını çeker ve istemcide gruplar.
   */
  static async getPopularCategories(): Promise<PopularCategory[]> {
    const { data, error } = await (supabaseClient as any)
      .from('events')
      .select('sub_category');

    if (error) {
      console.error('getPopularCategories error:', error);
      throw new Error('Could not fetch categories.');
    }

    if (!data || data.length === 0) return [];

    const categoryMap: Record<string, number> = {};

    for (const row of data) {
      const cat = row.sub_category || 'Unspecified';
      if (!categoryMap[cat]) categoryMap[cat] = 0;
      categoryMap[cat]++;
    }

    const result: PopularCategory[] = Object.entries(categoryMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // Büyükten küçüğe sırala

    if (result.length > 5) {
      const top5 = result.slice(0, 5);
      const others = result.slice(5);
      const otherCount = others.reduce((sum, item) => sum + item.count, 0);

      top5.push({ name: 'Other', count: otherCount });
      return top5;
    }

    return result;
  }
}
