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

  async suspendUser(): Promise<void> {
    // empty impl
  }

  async removeEvent(): Promise<void> {
    // empty impl
  }

  async reviewChatLogs(): Promise<void> {
    // empty impl
  }
}
