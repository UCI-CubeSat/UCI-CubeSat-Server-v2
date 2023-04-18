import { errorMessages } from "@/utils/errorMessages.js"
import { ZodError } from "zod"
import { RequestBodyError, StartNotBeforeEndError } from "../custom/request.js"
import { ErrorHandler } from "../index.js"

export const ZodErrorHandler: ErrorHandler<ZodError> = {
    type: ZodError,
    resolve: (e, res) => {
        res.status(400).json({
            message: errorMessages["400"]
        })
    }
}

export const RequestBodyErrorHandler: ErrorHandler<RequestBodyError> = {
    type: RequestBodyError,
    resolve: (e, res) => {
        res.status(400).json({
            message: errorMessages["400"]
        })
    }
}

export const StartNotBeforeEndErrorHandler: ErrorHandler<StartNotBeforeEndError> = {
    type: RequestBodyError,
    resolve: (e, res) => {
        res.status(400).json({
            message: e.message
        })
    }
}