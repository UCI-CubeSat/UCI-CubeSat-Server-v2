import type { Request, Response } from 'express';
import { z } from 'zod';

export const GenericErrorResponseValidator = z.object({
    message: z.string()
})

export type GenericErrorResponse = z.infer<typeof GenericErrorResponseValidator>

export type ErrorHandler<T> = {
    type: new (...args: any[]) => T,
    log: (e: T, req: Request) => void
    resolve: (e: T, res: Response<GenericErrorResponse>) => void
}


export const createGeneralInfo = (req: Request) =>
    `${req.method} ${req.url} with body: ${JSON.stringify(req.body)} and headers: ${JSON.stringify(req.headers)} at ${new Date()}`

export const logSuccess = (req: Request) => {
    const generalInfo = createGeneralInfo(req)
    console.log(`${generalInfo} | Success`)
}

export const logErrorNotCaught = (req: Request, e: unknown) => {
    const generalInfo = createGeneralInfo(req)
    console.error(`${generalInfo} | Failed to catch error for this route. Error ${e}`)
}

export const logNoResponseSent = (req: Request) => {
    const generalInfo = createGeneralInfo(req)
    console.error(`${generalInfo} | Failed to send back response in controllerFunction. Check code for this controller.`)
}

export const handleError = (e: unknown, req: Request, res: Response<GenericErrorResponse>, handlers: Array<ErrorHandler<any>>) => {
    for (let i = 0; i < handlers.length; i++) {
        const handler = handlers[i]
        if (e instanceof handler.type) {
            handler.log(e, req)
            handler.resolve(e, res)
            return;
        }
    }
}