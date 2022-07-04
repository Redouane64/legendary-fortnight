import { Router } from 'express'
import { appConfig } from '../../config'
import { Logger } from '../../logging'
import { CacheService } from '../services/cache-service'

const createOneRoute = Router()

/**
 * @swagger
 * /cache:
 *  post:
 *    tags:
 *      - /cache
 *    operationId: create
 *    summary: Create new cache entry
 *    description: Create or update cache entry
 *    parameters:
 *      - in: query
 *        name: ttl
 *        schema:
 *          type: integer
 *        required: false
 *        description: Custom TTL value
 *    responses:
 *      '201': 
 *        description: Cache entry created
 *      '401':
 *        description: Bad Request - Cache data not provided
 *      '500':
 *        description: Internal server error
 */
createOneRoute.post('/:key', async (request, response) => {
  const cacheService = new CacheService()

  try {
    const key = request.params['key']
    const ttl = Number(request.query['ttl']) || appConfig.defaultTtl
    const data = request.body.data

    if (!data) {
      return response.status(401).json({ error: "data is missing" }).end()
    }

    const entry = await cacheService.create({ key, data, ttl })
    return response.status(201).json(entry).end()
  } catch (error) {
    Logger.error(error)

    return response.status(500).end()
  }

})

export default createOneRoute