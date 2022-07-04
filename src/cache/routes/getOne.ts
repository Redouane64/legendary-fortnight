import { Router } from 'express'
import { Logger } from '../../logging'
import { CacheService } from '../services/cache-service'

const getOneRoute = Router()

/**
 * @swagger
 * /cache/{key}:
 *  get:
 *    tags:
 *      - /cache
 *    operationId: getOne
 *    parameters:
 *      - name: key
 *        in: path
 *        description: cache key
 *        required: true
 *        type: string
 *    summary: Get cached entry by key
 *    description: Get cached entry by key
 *    responses:
 *      '200': 
 *        description: cached entry
 *      '500':
 *        description: Internal server error
 */
getOneRoute.get('/:key', async (request, response) => {
  const cacheService = new CacheService()

  try {
    const entry = await cacheService.get(request.params['key'])
    return response.status(200).json(entry).end()
  } catch (error) {
    Logger.error(error)
    
    return response.status(500).end()
  }

})

export default getOneRoute