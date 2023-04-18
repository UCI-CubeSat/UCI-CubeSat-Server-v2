import { errorMessages } from "@/utils/errorMessages.js"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/index.js"
import { Response } from "express"
import { DatabaseDataError, DatabaseServiceParamError } from "../custom/database.js"
import { ErrorHandler, GenericErrorResponse, createGeneralInfo } from "../index.js"

export const DatabaseDataErrorHandler: ErrorHandler<DatabaseDataError> = {
    type: DatabaseDataError,
    log: (e, req) => console.error(`${createGeneralInfo(req)} | DatabaseDataError with message: ${e.message}.`),
    resolve: (e, res) => {
        res.status(500).json({
            message: errorMessages["known-database-error"]
        })
    }
}

export const PrismaKnownRequestErrorHandler: ErrorHandler<PrismaClientKnownRequestError> = {
    type: PrismaClientKnownRequestError,
    log: (e, req) => console.error(`${createGeneralInfo(req)} | PrismaClientKnownRequestError with code ${e.code}.`),
    resolve: (e: PrismaClientKnownRequestError, res: Response<GenericErrorResponse>) => {
        res.status(500).json({
            message: errorMessages["known-database-error"],
        })
    }
}

export const DatabaseServiceParamErrorHandler: ErrorHandler<DatabaseServiceParamError> = {
    type: DatabaseServiceParamError,
    log: (e, req) => console.error(`${createGeneralInfo(req)} | DatabaseServiceParamError with message: ${e.message}.`),
    resolve: (e, res) => {
        res.status(400).json({
            message: errorMessages["400"]
        })
    }
}
