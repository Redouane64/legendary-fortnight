import swaggerJSDoc, { SwaggerDefinition,  } from 'swagger-jsdoc'
import * as pkg from '../package.json'

const swaggerDef: SwaggerDefinition = {
  info: {
    title: 'Cache API',
    version: pkg.version,
    description: 'Sample Caching API service'
  },
}

export const swaggerSpec = swaggerJSDoc({
  apis: ['./**/*.ts'],
  swaggerDefinition: swaggerDef
})