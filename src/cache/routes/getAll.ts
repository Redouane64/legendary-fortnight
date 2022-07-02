import { Router } from 'express'

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
 *        description: cached data
 */
getAllRoute.get('/', (request, response) => {
  return response.status(200).json({ action: 'getAll' }).end();
})

export default getAllRoute