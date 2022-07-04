import { randomBytes } from 'crypto';
import config from '../../config';
import client from '../../database';
import { Logger } from '../../logging';
import { CacheEntry } from '../interfaces/cache-entry.interface';

type CreateCacheDto = Pick<CacheEntry, 'ttl' | 'key' | 'data'>

type CacheEntryDto = Pick<CacheEntry, 'data' | 'key'>

type GetCacheEntryDto = CacheEntry & Record<'has_expired',boolean>

export class CacheService {
  private readonly cacheDatabaseName = 'cache_api'
  private readonly cacheCollectionName = 'cache'

  private readonly collection = client.db(this.cacheDatabaseName)
                                      .collection<CacheEntry>(this.cacheCollectionName);

  async get(key: string): Promise<CacheEntryDto> {
    
    // find any existing entry with key and add `has_expired` field to result
    let [entry = null] = await this.collection.aggregate<GetCacheEntryDto>([{
        $addFields: {
          has_expired: {
            $lt: [
              {
                $toDate: {
                  $sum: [
                    '$last_hit',
                    '$ttl'
                  ]
                }
              },
              '$$NOW'
            ]
          }
        }
      }, {
        $match: {
          key,
        }
      }, {
        $limit: 1
      }
    ])
    .toArray()
    
    // if we hit, cache entry ttl is updated and entry is returned
    if (entry !== null && entry.has_expired === false) {
      const { value } = await this.collection.findOneAndUpdate(
        { key: entry.key },
        { $set: { last_hit: Date.now() } },
        { 
          upsert: false, 
          returnDocument: 'after', 
          projection: { _id: 0, key: 1, data: 1 } 
        }
      )
      
      Logger.info('Cache Hit')

      return { data: value!.data, key: value!.key }
    }

    // if we cache miss, either because of ttl exceeded
    // or entry does not exist in cache at all
    Logger.info('Cache Hit')
    
    const newEntry: CacheEntry = {
      key,
      ttl: entry?.has_expired ? entry.ttl : config.defaultTtl,
      last_hit: Date.now(),

      data: Buffer.from(randomBytes(12)).toString('base64'),
    }

    const { value } = await this.collection.findOneAndUpdate(
      { key: key },
      { $set: newEntry },
      { 
        upsert: true, 
        returnDocument: 'after', 
        projection: { _id: 0, key: 1, data: 1 } 
      }
    )
      
    // return random string
    return { data: value!.data, key: value!.key }
  }

  async getAll(): Promise<CacheEntry[]> {
    return await this.collection.aggregate<CacheEntry>([
      {
        $addFields: {
          expires: {
            $toLong: {
              $sum: [
                '$last_hit',
                '$ttl'
              ]
            }
          },
          has_expired: {
            $lt: [
              {
                $toDate: {
                  $sum: [
                    '$last_hit',
                    '$ttl'
                  ]
                }
              },
              '$$NOW'
            ]
          }
        },
      }, { 
        $match: {
          has_expired: false
        }
      }, {
        $sort: {
          last_hit: -1
        }
      }, {
        $project: {
          key: 1,
          data: 1,
          _id: 0,
        }
      }
    ])
    .toArray()
  }

  async create(entry: CreateCacheDto) : Promise<CacheEntryDto> {
    
    return { key: '', data: '' }
  }

  async delete(key: string): Promise<void> {
    await this.collection.deleteOne({
      key
    })
  }

  async deleteAll(): Promise<void> {
    await this.collection.deleteMany({ })
  }
}