import { errorMessages } from '@/utils/errorMessages.js'
import { Response } from 'express'
import { ErrorHandler, GenericErrorResponse, createGeneralInfo } from "../index.js"

export const ServerErrorHandler: ErrorHandler<Error> = {
    type: Error,
    log: (e, req) => console.error(`${createGeneralInfo(req)} | Unknown ServerError with message: ${e.message}.`),
    resolve: (e: Error, res: Response<GenericErrorResponse>) => {
        res.status(500).json({
            message: errorMessages["500"]
        })
    }
}