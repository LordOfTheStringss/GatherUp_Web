export interface EventRepository {
  findEventsByRegion(regionId: string): Promise<any[]>;
}
