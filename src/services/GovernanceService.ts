import { supabaseClient } from '../infra/supabase';

export interface AllowedDomain {
  id: string; // UUID
  domain: string;
  created_at: string;
}

export class GovernanceService {
  /**
   * Domain validasyonunu sağlayan regex.
   * Örn: "metu.edu.tr", "gmail.com", vb.
   */
  private static domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  /**
   * allowed_domains tablosundan tüm onaylı domainleri çeker.
   */
  static async getAllDomains(): Promise<AllowedDomain[]> {
    const { data, error } = await supabaseClient
      .from('allowed_domains')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getAllDomains error:', error);
      throw new Error(error.message);
    }

    return (data as AllowedDomain[]) || [];
  }

  /**
   * Yeni bir domain ekler. Öncesinde regex doğrulaması yapar.
   */
  static async addDomain(domain: string): Promise<AllowedDomain> {
    const trimmedDomain = domain.trim().toLowerCase();

    if (!this.domainRegex.test(trimmedDomain)) {
      throw new Error('Geçersiz domain formatı. Örn. "metu.edu.tr"');
    }

    const { data, error } = await supabaseClient
      .from('allowed_domains')
      .insert({
        domain: trimmedDomain,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('addDomain error:', error);
      throw new Error(error.message);
    }

    return data as AllowedDomain;
  }

  /**
   * Verilen domaini allowed_domains tablosundan siler.
   */
  static async removeDomain(domain: string): Promise<void> {
    const trimmedDomain = domain.trim().toLowerCase();

    const { error } = await supabaseClient
      .from('allowed_domains')
      .delete()
      .eq('domain', trimmedDomain);

    if (error) {
      console.error('removeDomain error:', error);
      throw new Error(error.message);
    }
  }

  /**
   * Bu domain ile biten email adreslerine sahip kullanıcıları listeler.
   */
  static async auditDomainRegistration(domain: string): Promise<any[]> {
    // LIKE sorgusu '%@domain' şeklinde, supabase-js için .like() veya .ilike() kullanırız.
    const { data, error } = await supabaseClient
      .from('users')
      .select('id, full_name, email, status, reputation_score')
      .ilike('email', `%@${domain}`);

    if (error) {
      console.error('auditDomainRegistration error:', error);
      throw new Error(error.message);
    }

    return data || [];
  }
}
