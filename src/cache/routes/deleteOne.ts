import { Router } from 'express'

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
 *        description: No Content
 */
deleteOneRoute.delete('/:key', (request, response) => {
  return response.status(200).json({ action: 'deleteOne' }).end();
})

export default deleteOneRoute