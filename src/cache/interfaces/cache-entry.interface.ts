
export interface CacheEntry {
  key: string
  ttl: number
  last_hit: number
  data: any
}