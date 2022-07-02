import { Router } from 'express'

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
 *        description: No Content
 */
deleteAllRoute.delete('/', (request, response) => {
  return response.status(200).json({ action: 'deleteAll' }).end();
})

export default deleteAllRoute