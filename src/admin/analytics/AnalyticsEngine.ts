import { HeatmapData } from './HeatmapData';

export interface CategoryRank {
  category: string;
  rank: number;
}

export class AnalyticsEngine {
  cacheTTL: number;
  queryTimeout: number;

  constructor(cacheTTL: number, queryTimeout: number) {
    this.cacheTTL = cacheTTL;
    this.queryTimeout = queryTimeout;
  }

  getUserGrowthMetrics(): Record<string, any> {
    return { growth: '12%' };
  }

  getPopularCategories(): CategoryRank[] {
    return [];
  }

  getRegionalHeatmap(): HeatmapData {
    return new HeatmapData([], new Date());
  }
}
