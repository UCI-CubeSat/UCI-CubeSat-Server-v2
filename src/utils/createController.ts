import type { Request, Response } from 'express'
import { GenericErrorResponse } from '../services/errorHandling.js'
import { errorMessages } from './errorMessages.js'
import { logNoSendError } from '@/utils/logging.js'


export const createController = (
    controllerFunction: (req: Request, res: Response) => void
) => {
    return (req: Request, res: Response) => {
        try {
            controllerFunction(req, res)
        }
        finally {
            if (!res.headersSent) {
                logNoSendError(req)
                res.status(500).json({
                    error: true,
                    errorMessage: errorMessages["500"]
                } as GenericErrorResponse)
            }
        }
    }
}