import { GenericErrorResponse, logErrorNotCaught, logNoResponseSent, logSuccess } from '@/error/index.js'
import type { Request, Response } from 'express'
import { errorMessages } from './errorMessages.js'


export const ensureResponse = (
    controllerFunction: (req: Request, res: Response) => Promise<void>
) => {
    return async (req: Request, res: Response) => {
        try {
            await controllerFunction(req, res)
            logSuccess(req)
        }
        catch (e) {
            logErrorNotCaught(req, e)
        }
        if (!res.headersSent) {
            logNoResponseSent(req)
            res.status(500).json({
                message: errorMessages["500"]
            } as GenericErrorResponse)
        }
    }
}