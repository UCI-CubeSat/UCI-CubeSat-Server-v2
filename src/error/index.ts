import type { Response } from 'express';
import { z } from 'zod';

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