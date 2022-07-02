import { Router } from 'express'

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
 */
getOneRoute.get('/:key', (request, response) => {
  return response.status(200).json({ action: 'getOne' }).end();
})

export default getOneRoute