import { Router } from 'express'

const deleteAllRoute = Router()

deleteAllRoute.delete('/', (request, response) => {
  return response.status(200).json({ action: 'deleteAll' }).end();
})

export default deleteAllRoute