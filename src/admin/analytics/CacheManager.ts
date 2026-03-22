export interface CacheManager {
  get(key: string): any;
  set(key: string, value: any): void;
}
