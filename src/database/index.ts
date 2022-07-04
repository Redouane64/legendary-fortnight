import { MongoClient } from 'mongodb'
import config from '../config'
import { Logger } from '../logging'

// initialize mongodb client instance
const client = new MongoClient(config.mongoUrl)

;(async () => {

  client.on('serverOpening', (event) => {
    Logger.info(`Connected to database server at ${event.address} successfully`)
  })

  client.on('serverClosed', (event) => {
    Logger.error(`Connection to database server ${event.address} closed`)
  })

  await client.connect()

})()

/**
 * MongoDB client instance
 */
export default client