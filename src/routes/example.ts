import { Router } from 'express'
import { getExamples } from '@/controllers/example.js'

export const exampleRouter = Router()
    .get('/', getExamples)