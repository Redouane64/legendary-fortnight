import { Router } from 'express'

const getOneRoute = Router()

getOneRoute.get('/:key', (request, response) => {
  return response.status(200).json({ action: 'getOne' }).end();
})

export default getOneRoute