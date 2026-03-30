import { DomainIntegrityException, InvalidDomainFormatException } from '../../core/exceptions';

export interface User { id: string; domain: string; }

export class DomainWhitelister {
  allowedDomains: string[];

  constructor(initialDomains: string[] = []) {
    this.allowedDomains = initialDomains;
  }

  addDomain(domain: string): boolean {
    if (!domain.includes('.')) {
      throw new InvalidDomainFormatException('Invalid domain string format');
    }
    if (!this.allowedDomains.includes(domain)) {
      this.allowedDomains.push(domain);
      return true;
    }
    return false;
  }

  removeDomain(domain: string): void {
    try {
      // Simulate check for active users
      const hasActiveUsers = false; 
      if (hasActiveUsers) {
        throw new DomainIntegrityException('Cannot remove domain with active users');
      }
      this.allowedDomains = this.allowedDomains.filter(d => d !== domain);
    } catch(err) {
      if (err instanceof DomainIntegrityException) {
        // [EMPTY HANDLING ISKELETI]
        console.warn('Caught DomainIntegrityException: Cannot remove active domain');
      } else {
        throw err;
      }
    }
  }

  auditDomainRegistration(): User[] {
    return [];
  }
}
