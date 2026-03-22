import { Moderator } from '../moderation/Moderator';
import { ReportManager } from '../moderation/ReportManager';
import { SystemHealthMonitor } from '../governance/SystemHealthMonitor';
import { DomainWhitelister } from '../governance/DomainWhitelister';
import { Action, Status } from '../../core/types';
import { Report } from '../moderation/Report';

export class ResponseEntity<T> {
  status: number;
  data?: T;
  constructor(status: number, data?: T) {
    this.status = status;
    this.data = data;
  }
}

export class AdminController {
  moderatorService: Moderator;
  reportManager: ReportManager;
  healthMonitor: SystemHealthMonitor;
  domainWhitelister: DomainWhitelister;

  constructor(
    moderatorService: Moderator,
    reportManager: ReportManager,
    healthMonitor: SystemHealthMonitor,
    domainWhitelister: DomainWhitelister
  ) {
    this.moderatorService = moderatorService;
    this.reportManager = reportManager;
    this.healthMonitor = healthMonitor;
    this.domainWhitelister = domainWhitelister;
  }

  async getPendingReports(): Promise<ResponseEntity<Report[]>> {
    const reports = await this.reportManager.getPendingReports();
    return new ResponseEntity(200, reports);
  }

  async resolveReport(reportId: string, action: Action): Promise<ResponseEntity<any>> {
    await this.reportManager.closeReport(reportId);
    return new ResponseEntity(200, { message: 'Report resolved', action });
  }

  async addWhitelistedDomain(domain: string): Promise<ResponseEntity<any>> {
    const success = this.domainWhitelister.addDomain(domain);
    if (!success) return new ResponseEntity(400, { message: 'Domain addition failed' });
    return new ResponseEntity(200, { message: 'Domain added' });
  }

  async getSystemStatus(): Promise<ResponseEntity<Map<string, Status>>> {
    const status = this.healthMonitor.checkServiceStatus();
    const statusMap = new Map<string, Status>([
      ['overall', status]
    ]);
    return new ResponseEntity(200, statusMap);
  }
}
