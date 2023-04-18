import { errorMessages } from '@/utils/errorMessages.js'
import { Response } from 'express'
import { ErrorHandler, GenericErrorResponse } from "../index.js"

export const ServerErrorHandler: ErrorHandler<Error> = {
    type: Error,
    resolve: (e: Error, res: Response<GenericErrorResponse>) => {
        res.status(500).json({
            message: errorMessages["500"]
        })
    }
}