import Express from 'express'
import cors from 'cors'
import BodyParser from 'body-parser';

import config from './config'
import { ExpressLogger, Logger } from './logging';

const app = Express();
app.use(cors({
  methods: ['*']
}))
app.disable('x-powered-by')

app.use(ExpressLogger)
app.use(BodyParser.urlencoded({ extended: false }))

// GET / 
app.get("/", (_, response) => {
  return response.json({ success: true }).status(200);
})

// GET *
app.get("*", (_, response) => {
  return response.status(404).end()
})

app.listen(config.port, config.host, () => {
  Logger.info(`Listening on ${config.host}:${config.port}`)
})