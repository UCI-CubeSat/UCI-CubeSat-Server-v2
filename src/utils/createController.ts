import { logErrorNotCaught, logNoResponseSent } from '@/utils/logging.js'
import type { Request, Response } from 'express'
import { GenericErrorResponse } from '../services/errorHandling.js'
import { errorMessages } from './errorMessages.js'


export const createController = (
    controllerFunction: (req: Request, res: Response) => Promise<void>
) => {
    return async (req: Request, res: Response) => {
        try {
            await controllerFunction(req, res)
        }
        catch (e) {
            logErrorNotCaught(req, e)
        }
        finally {
            if (!res.headersSent) {
                logNoResponseSent(req)
                res.status(500).json({
                    message: errorMessages["500"]
                } as GenericErrorResponse)
            }
        }
    }
}