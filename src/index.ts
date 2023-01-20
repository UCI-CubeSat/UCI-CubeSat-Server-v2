import express from 'express'
import cors from 'cors'
import { env } from '@/services/env.js'
import { satelliteController } from './controllers/satellite.js'

const expressApp = express()

// Top level middlewares
expressApp.use(cors({
    origin: env.FRONTEND_ORIGIN
}))
expressApp.use(express.json());

// Attach routers
expressApp.use('/satellite', satelliteController)

expressApp.listen(env.PORT, env.HOST_NAME, () => {
    console.log(`Example app listening on port ${env.PORT}`)
})
