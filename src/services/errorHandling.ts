import { PrismaClientKnownRequestError } from '@prisma/client/runtime/index.js';
import type { Response } from 'express';
import { ZodError, z } from 'zod';
import { errorMessages } from '../utils/errorMessages.js';

export const GenericErrorResponseValidator = z.object({
    error: z.literal(true),
    errorMessage: z.string()
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

// Define Error Handlers Below

export const ZodErrorHandler: ErrorHandler<ZodError> = {
    type: ZodError,
    resolve: (e, res) => {
        res.status(400).json({
            error: true,
            errorMessage: errorMessages["400"]
        })
    }
}

export const PrismaKnownRequestErrorHandler: ErrorHandler<PrismaClientKnownRequestError> = {
    type: PrismaClientKnownRequestError,
    resolve: (e: PrismaClientKnownRequestError, res: Response<GenericErrorResponse>) => {
        res.status(500).json({
            error: true,
            errorMessage: errorMessages["known-database-error"],
        })
    }
}

export const ServerErrorHandler: ErrorHandler<Error> = {
    type: Error,
    resolve: (e: Error, res: Response<GenericErrorResponse>) => {
        res.status(500).json({
            error: true,
            errorMessage: errorMessages["500"]
        })
    }
}