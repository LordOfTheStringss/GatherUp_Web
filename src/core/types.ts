// src/core/types.ts
export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MODERATOR = 'MODERATOR',
  ANALYST = 'ANALYST',
}

export enum TargetType {
  USER = 'USER',
  EVENT = 'EVENT',
  CHAT = 'CHAT',
}

export enum Status {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
  OK = 'OK', 
  ERROR = 'ERROR'
}

export type Action = 'BAN_USER' | 'IGNORE';
