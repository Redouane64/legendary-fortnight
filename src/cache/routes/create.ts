import { Router } from 'express'

const createOneRoute = Router()

createOneRoute.post('/:key', (request, response) => {
  return response.status(201).json({ action: 'create' }).end();
})

export default createOneRoute