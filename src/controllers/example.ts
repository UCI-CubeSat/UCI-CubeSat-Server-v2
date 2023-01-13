import { getListOfExamples } from '@/services/example.js'
import type { Request, Response, NextFunction } from 'express'

export const getExamples = async (req: Request, res: Response, next: NextFunction) => {
    const exampleList = getListOfExamples()
    res.status(200).send({
        messages: exampleList
    })
}