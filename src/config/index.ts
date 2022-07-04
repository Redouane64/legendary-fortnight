import dotenv from 'dotenv'

dotenv.config()

export interface AppConfigProps {
  env: string
  host: string
  port: number
  mongoUrl: string
  defaultTtl: number
  cacheSize: number
}

export const appConfig : AppConfigProps = {
  env: process.env.NODE_ENV || "development",
  host: process.env.HOST!,
  port: Number(process.env.PORT),
  mongoUrl: process.env.MONGO_URL!,
  defaultTtl: Number(process.env.DEFAULT_TTL_MS) || 30_000,
  cacheSize: Number(process.env.CACHE_SIZE) || 10,
}