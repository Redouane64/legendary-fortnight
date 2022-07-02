import { Router } from 'express'

const getAllRoute = Router()

getAllRoute.get('/', (request, response) => {
  return response.status(200).json({ action: 'getAll' }).end();
})

export default getAllRoute