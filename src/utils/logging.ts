import { PrismaClientKnownRequestError } from "@prisma/client/runtime/index.js"
import { ZodError } from "zod"
import { Request } from "express"

export const createGeneralInfo = (req: Request) =>
    `${req.method} ${req.url} with body: ${JSON.stringify(req.body)} and headers: ${JSON.stringify(req.headers)} at ${new Date()}`

export const logNoSendError = (req: Request) => {
    const generalInfo = createGeneralInfo(req)
    console.error(`${generalInfo} | Failed to send back response in controllerFunction. Check code for this controller.`)
}

export const logError = (e: unknown, req: Request) => {
    const generalInfo = createGeneralInfo(req)
    switch (true) {
        case e instanceof ZodError:
            const zodIssues = (e as ZodError).issues.map(issue => issue.code).join(', ')
            console.error(`${generalInfo} | ZodError with following issue codes: ${zodIssues}.`)
            break;
        case e instanceof PrismaClientKnownRequestError:
            console.error(`${generalInfo} | PrismaClientKnownRequestError with code ${(e as PrismaClientKnownRequestError).code}.`)
            break;
        default:
            console.error(`${generalInfo} | Unknown error occured.`)
    };
}