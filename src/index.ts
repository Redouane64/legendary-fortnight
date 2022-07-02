import Express from 'express'
import cors from 'cors'
import BodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'

import config from './config'
import { ExpressLogger, Logger } from './logging'
import cacheRoute from './cache'

import { swaggerSpec } from './swagger'

const app = Express();
app.use(cors({
  methods: ['*']
}))
app.disable('x-powered-by')

app.use(ExpressLogger)
app.use(BodyParser.urlencoded({ extended: false }))

// Swagger doc
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// GET / 
/**
 * @swagger
 * /:
 *  get:
 *    tags:
 *      - /
 *    operationId: Root
 *    description: Health check
 *    responses:
 *      '200': 
 *        description: server status object
 */
app.get("/", (_, response) => {
  return response.json({ success: true }).status(200);
})

app.use(cacheRoute)

// Any invalid route return 404
app.all("*", (_, response) => {
  return response.status(404).end()
})

app.listen(config.port, config.host, () => {
  Logger.info(`Listening on ${config.host}:${config.port}`)
})