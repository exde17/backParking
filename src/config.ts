import { registerAs } from '@nestjs/config'

export default registerAs('config', () => {
  return {
    database: {
      dbName: process.env.DB_NAME,
      dbPort: parseInt(process.env.DB_PORT ?? '5432', 10),
      dbHost: process.env.DB_HOST,
      dbUsername: process.env.DB_USERNAME,
      dbPassword: process.env.DB_PASSWORD, 
    },
    host: process.env.HOST_API,
    port: process.env.PORT,
  }
})
