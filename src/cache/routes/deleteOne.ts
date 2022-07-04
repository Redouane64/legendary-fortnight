import { Router } from 'express'
import { Logger } from '../../logging'
import { CacheService } from '../services/cache-service'

const deleteOneRoute = Router()

/**
 * @swagger
 * /cache/{key}:
 *  delete:
 *    tags:
 *      - /cache
 *    operationId: deleteOne
 *    parameters:
 *      - name: key
 *        in: path
 *        description: cache key
 *        required: true
 *        type: string
 *    summary: Delete cache entry by key
 *    description: Delete cached value by key
 *    responses:
 *      '204': 
 *        description: Cache entry deleted successfully
 *      '500':
 *        description: Internal server error
 */
deleteOneRoute.delete('/:key', async (request, response) => {
  const cacheService = new CacheService()

  try {
    await cacheService.delete(request.params['key'])
    return response.status(204).end()
  } catch (error) {
    Logger.error(error)

    return response.status(500).end()
  }
  
})

export default deleteOneRoute