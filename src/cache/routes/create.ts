import { Router } from 'express'

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
 *        description: Created
 */
createOneRoute.post('/:key', (request, response) => {
  return response.status(201).json({ action: 'create' }).end();
})

export default createOneRoute