import dotenv from 'dotenv'

dotenv.config()

export interface AppConfigProps {
  env: string
  host: string
  port: number
  mongoUrl: string
}

export default (() : AppConfigProps => ({
  env: process.env.NODE_ENV || "development",
  host: process.env.HOST!,
  port: Number(process.env.PORT),
  mongoUrl: process.env.MONGO_URL!,
}))()