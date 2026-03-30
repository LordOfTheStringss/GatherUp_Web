export interface User {
  id: string; // UUID
  full_name: string;
  email: string;
  reputation_score: number;
  status: 'ACTIVE' | 'BANNED' | 'BUSY';
}

export interface Report {
  id: string; // UUID
  target_id: string; // UUID
  target_type: 'USER' | 'EVENT' | 'CHAT';
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  description: string;
  created_at: string;
}

// Ek olarak ModerationService için Event tipine de ihtiyaç var (soft delete için).
export interface Event {
  id: string; // UUID
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
}

export interface AllowedDomain {
  id: string;
  domain: string;
  created_at: string;
}