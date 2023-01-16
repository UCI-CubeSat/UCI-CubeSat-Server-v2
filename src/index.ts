import express from 'express'
import cors from 'cors'
import { env } from '@/services/env.js'
import { satelliteController } from './controllers/satellite.js'

const expressApp = express()

// Top level middlewares
expressApp.use(cors())
expressApp.use(express.json());

// Attach additional middlewares

// Attach routers
expressApp.use('/satellite', satelliteController)

expressApp.listen(env.PORT, '0.0.0.0', () => {
    console.log(`Example app listening on port ${env.PORT}`)
})
