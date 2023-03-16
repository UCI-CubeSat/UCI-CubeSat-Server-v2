import { PrismaClientKnownRequestError } from '@prisma/client/runtime/index.js';
import type { Response } from 'express';
import { ZodError, z } from 'zod';
import { errorMessages } from '../utils/errorMessages.js';

export const GenericErrorResponseValidator = z.object({
    message: z.string()
})

export type GenericErrorResponse = z.infer<typeof GenericErrorResponseValidator>

export type ErrorHandler<T> = {
    type: new (...args: any[]) => T,
    resolve: (e: T, res: Response<GenericErrorResponse>) => void
}

export const handleError = (e: unknown, res: Response<GenericErrorResponse>, handlers: Array<ErrorHandler<any>>) => {
    for (let i = 0; i < handlers.length; i++) {
        const handler = handlers[i]
        if (e instanceof handler.type) {
            handler.resolve(e, res)
            return;
        }
    }
}
// Custom Error Types

export class DatabaseServiceParamError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "DatabaseServiceParamError"
    }
}

export class RequestBodyError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "RequestBodyError"
    }
}

export class DatabaseDataError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "DatabaseDataError"
    }
}

export class StartNotBeforeEndError extends Error {
    constructor() {
        super("Start is not before end.")
        this.name = "RequestBodyError"
    }
}

// Define Error Handlers Below

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

export const DatabaseServiceParamErrorHandler: ErrorHandler<DatabaseServiceParamError> = {
    type: DatabaseServiceParamError,
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

export const DatabaseDataErrorHandler: ErrorHandler<DatabaseDataError> = {
    type: DatabaseDataError,
    resolve: (e, res) => {
        res.status(500).json({
            message: errorMessages["known-database-error"]
        })
    }
}

export const PrismaKnownRequestErrorHandler: ErrorHandler<PrismaClientKnownRequestError> = {
    type: PrismaClientKnownRequestError,
    resolve: (e: PrismaClientKnownRequestError, res: Response<GenericErrorResponse>) => {
        res.status(500).json({
            message: errorMessages["known-database-error"],
        })
    }
}

export const ServerErrorHandler: ErrorHandler<Error> = {
    type: Error,
    resolve: (e: Error, res: Response<GenericErrorResponse>) => {
        res.status(500).json({
            message: errorMessages["500"]
        })
    }
}