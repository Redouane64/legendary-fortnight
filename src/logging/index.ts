import PinoHttp, { Options } from 'pino-http'
import Pino from 'pino'

const loggingOptions: Options = {
  // additional logging config can be added here
  base: undefined,
  timestamp: Pino.stdTimeFunctions.isoTime,
  redact: {
    remove: true, 
    paths: [
      'req.id', 
      'req.query', 
      'req.params', 
      'req.headers', 
      'req.remoteAddress', 
      'req.remotePort', 
      'res.headers'
    ]
  }
}

export const Logger = Pino(loggingOptions)

export const ExpressLogger = PinoHttp(loggingOptions)
