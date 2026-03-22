import { Role } from '../../core/types';

export class Moderator {
  adminId: string;
  role: Role;
  permissions: string[];

  constructor(adminId: string, role: Role, permissions: string[]) {
    this.adminId = adminId;
    this.role = role;
    this.permissions = permissions;
  }

  async suspendUser(userId: string): Promise<void> {
    // empty impl
  }

  async removeEvent(eventId: string): Promise<void> {
    // empty impl
  }

  async reviewChatLogs(eventId: string): Promise<void> {
    // empty impl
  }
}
