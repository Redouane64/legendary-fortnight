import { Router } from 'express'
import { Logger } from '../../logging'
import { CacheService } from '../services/cache-service'

const getAllRoute = Router()

/**
 * @swagger
 * /cache:
 *  get:
 *    tags:
 *      - /cache
 *    operationId: getAll
 *    summary: Get all cached entries
 *    description: Get all cache entries
 *    responses:
 *      '200': 
 *        description: All cached data returned successfully
 *      '500':
 *        description: Internal server error
 */
getAllRoute.get('/', async (request, response) => {
  const cacheService = new CacheService()

  try {
    const entries = await cacheService.getAll()
    return response.status(200).json(entries).end()
  } catch (error) {
    Logger.error(error)
    
    return response.status(500).end()
  }

})

export default getAllRoute