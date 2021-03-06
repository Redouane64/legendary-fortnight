import Express from 'express'
import cors from 'cors'
import BodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'

import { appConfig } from './config'
import { ExpressLogger, Logger } from './logging'
import cacheRoute from './cache'

import { swaggerSpec } from './swagger'

const app = Express();
app.use(cors({
  methods: ['*']
}))
app.disable('x-powered-by')

app.use(ExpressLogger)
app.use(BodyParser.json())

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

app.listen(appConfig.port, appConfig.host, () => {
  Logger.info(`Listening on ${appConfig.host}:${appConfig.port}`)
})