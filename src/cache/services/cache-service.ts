import { randomBytes } from 'crypto';
import { appConfig } from '../../config';
import client from '../../database';
import { Logger } from '../../logging';
import { CacheEntry } from '../interfaces/cache-entry.interface';

type CreateCacheDto = Pick<CacheEntry, 'ttl' | 'key' | 'data'>

type CacheEntryDto = Pick<CacheEntry, 'data' | 'key'>

type GetCacheEntryDto = CacheEntry & Record<'has_expired',boolean>


type GetOldestEntryWithTotal = Partial<{
  total: number,
  oldest_entry: Partial<Pick<CacheEntry, 'key'>>
}>

export class CacheService {
  private readonly cacheDatabaseName = 'cache_db'
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
    Logger.info('Cache Miss')

    const newEntry: CacheEntry = {
      key,
      ttl: entry?.has_expired ? entry.ttl : appConfig.defaultTtl,
      last_hit: Date.now(),
      
      data: Buffer.from(randomBytes(12)).toString('base64'),
    }

    return await this._insertWithCacheSizeCheck(newEntry)
  }

  async getAll(): Promise<CacheEntry[]> {
    return await this.collection.aggregate<CacheEntry>([
      {
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
    // try update any existing entry with same key
    const updateResult = await this.collection.findOneAndUpdate({
      key: entry.key
    }, {
      $set: {
        ttl: entry.ttl,
        data: entry.data,
        last_hit: Date.now()
      }
    }, {
      returnDocument: 'after', 
      projection: { _id: 0, key: 1, data: 1 }
    })

    // if an entry is updated, we return
    if (updateResult?.lastErrorObject?.updatedExisting) {
      return updateResult.value!;
    }

    // at this point of execution, we need to insert new entry.
    return await this._insertWithCacheSizeCheck(entry)
  }

  async _insertWithCacheSizeCheck(entry: CreateCacheDto): Promise<CacheEntryDto> {
    // get total cache size and the entry with oldest hit
    const defaultResult: GetOldestEntryWithTotal = { total: 0 }
    const [result = defaultResult] = await this.collection.aggregate<GetOldestEntryWithTotal>(
      [
        {
          '$sort': {
            'last_hit': 1
          }
        }, {
          '$group': {
            '_id': null, 
            'oldest_entry': {
              '$first': {
                'key': '$key',
              }
            }, 
            'total': {
              '$sum': 1
            }
          }
        }
      ]
    ).toArray()

    // if cache size is full, the we replace oldest entry
    if (result.total! >= appConfig.cacheSize) {
      const replacedEntry = await this.collection.findOneAndUpdate({
        key: result?.oldest_entry?.key
      }, {
        $set: {
          ttl: entry.ttl,
          key: entry.key,
          last_hit: Date.now(),
          data: entry.data
        }
      }, { 
        upsert: false,
        returnDocument: 'after',
        projection: { _id: 0, key: 1, data: 1 }
      })

      return replacedEntry.value!
    }

    // else, we are good, we create new entry
    await this.collection.insertOne({
      key: entry.key,
      ttl: entry.ttl || appConfig.defaultTtl,
      last_hit: Date.now(),
      data: entry.data,
    })

    return { key: entry.key, data: entry.data }
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