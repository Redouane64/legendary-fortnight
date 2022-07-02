import { Router } from 'express'
import createOneRoute from './routes/create'
import deleteAllRoute from './routes/deleteAll'
import deleteOneRoute from './routes/deleteOne'
import getAllRoute from './routes/getAll'
import getOneRoute from './routes/getOne'

const cacheRoute = Router()
const routePrefix = '/cache'

// GET /cache/
cacheRoute.use(routePrefix, getAllRoute)

// GET /cache/:key
cacheRoute.use(routePrefix, getOneRoute)

// POST /cache/:key
cacheRoute.use(routePrefix, createOneRoute)

// DELETE /cache/
cacheRoute.use(routePrefix, deleteAllRoute)

// DELETE /cache/:key
cacheRoute.use(routePrefix, deleteOneRoute)

export default cacheRoute
