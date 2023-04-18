import { errorMessages } from "@/utils/errorMessages.js"
import { ZodError } from "zod"
import { RequestBodyError, StartNotBeforeEndError } from "../custom/request.js"
import { ErrorHandler, createGeneralInfo } from "../index.js"

export const ZodErrorHandler: ErrorHandler<ZodError> = {
    type: ZodError,
    log: (e, req) => console.error(`${createGeneralInfo(req)} | ZodError with following issue codes: ${e.issues.map(issue => issue.code).join(', ')}.`),
    resolve: (e, res) => {
        res.status(400).json({
            message: errorMessages["400"]
        })
    }
}

export const RequestBodyErrorHandler: ErrorHandler<RequestBodyError> = {
    type: RequestBodyError,
    log: (e, req) => console.error(`${createGeneralInfo(req)} | RequestBodyError with following message: ${e.message}.`),
    resolve: (e, res) => {
        res.status(400).json({
            message: errorMessages["400"]
        })
    }
}

export const StartNotBeforeEndErrorHandler: ErrorHandler<StartNotBeforeEndError> = {
    type: RequestBodyError,
    log: (e, req) => console.error(`${createGeneralInfo(req)} | StartNotBeforeEndError with following message: ${e.message}.`),
    resolve: (e, res) => {
        res.status(400).json({
            message: e.message
        })
    }
}