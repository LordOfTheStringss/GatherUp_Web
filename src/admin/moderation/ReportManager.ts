import { TargetType, Status } from '../../core/types';
import { Report } from './Report';
import { StaleObjectStateException } from '../../core/exceptions';

export class ReportManager {
  reportId: string;
  targetType: TargetType;
  status: Status;
  evidence: Record<string, any>; // JSON mapping

  constructor(reportId: string, targetType: TargetType, status: Status, evidence: any) {
    this.reportId = reportId;
    this.targetType = targetType;
    this.status = status;
    this.evidence = evidence;
  }

  async assignToModerator(moderatorId: string): Promise<void> {
    // empty impl
  }

  async getPendingReports(): Promise<Report[]> {
    return [];
  }

  async closeReport(reportId: string): Promise<void> {
    try {
      // if (conflict) throw new StaleObjectStateException();
      this.status = Status.RESOLVED;
    } catch(error) {
      if (error instanceof StaleObjectStateException) {
        // Edge Case Handling: StaleObjectStateException
        console.warn('Caught StaleObjectStateException: Another mod is handling this.');
      } else {
        throw error;
      }
    }
  }
}
