import { Router } from 'express'

const deleteOneRoute = Router()

deleteOneRoute.delete('/:key', (request, response) => {
  return response.status(200).json({ action: 'deleteOne' }).end();
})

export default deleteOneRoute