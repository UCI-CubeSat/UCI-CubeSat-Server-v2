import express from 'express'
import cors from 'cors'
import { exampleRouter } from '@/routes/example.js'
import { loggingMiddleware } from './middlewares/example.js'
import { env } from "@/services/env.js";

const app = express()

// Top level middlewares
app.use(cors())
app.use(express.json());
app.use(loggingMiddleware)

// Attach routers
app.use('/example', exampleRouter)

app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`Example app listening on port ${env.PORT}`)
})
