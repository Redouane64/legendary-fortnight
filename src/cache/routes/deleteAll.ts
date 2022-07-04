import { Router } from 'express'
import { Logger } from '../../logging'
import { CacheService } from '../services/cache-service'

const deleteAllRoute = Router()

/**
 * @swagger
 * /cache:
 *  delete:
 *    tags:
 *      - /cache
 *    operationId: deleteAll
 *    summary: Clear cache
 *    description: Clear cache
 *    responses:
 *      '204': 
 *        description: Cache cleared successfully
 *      '500':
 *        description: Internal server error
 */
deleteAllRoute.delete('/', async (request, response) => {
  const cacheService = new CacheService()

  try {
    const entry = await cacheService.deleteAll()
    return response.status(204).json(entry).end()
  } catch (error) {
    Logger.error(error)

    return response.status(500).end()
  }
  
})

export default deleteAllRoute