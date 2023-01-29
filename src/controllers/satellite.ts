import { ParsedLogValidator } from '@/models/logs.js'
import { prisma } from '@/services/db.js'
import { GenericErrorResponse, PrismaKnownRequestErrorHandler, ServerErrorHandler, ZodErrorHandler, handleError } from "@/services/errorHandling.js"
import { createController } from "@/utils/createController.js"
import { logError } from "@/utils/logging.js"
import { Response, Router } from "express"
import { z } from "zod"

export const satelliteController = Router()

/**
 * start: Start time (represented as seconds from UNIX epoch) for logs 
 * end: End time (represented as seconds from UNIX epoch) for logs 
 */
export const PostLogListReqBodyValidator = z.object({
    start: z.number().min(1),
    end: z.number().min(1)
})
export const PostLogListResBodyValidator = z.object({
    error: z.literal(false),
    logs: z.array(ParsedLogValidator)
})
export type PostLogListReqBody = z.infer<typeof PostLogListReqBodyValidator>
export type PostLogListResBody = z.infer<typeof PostLogListResBodyValidator>
satelliteController.post('/logList', createController(async (req, res: Response<PostLogListResBody | GenericErrorResponse>) => {
    try {
        const body = PostLogListReqBodyValidator.parse(req.body)
        const databaseLogs = await prisma.log.findMany({
            orderBy: [
                {
                    timestamp: "desc"
                }
            ],
            where: {
                timestamp: {
                    gte: body.start,
                    lte: body.end
                }
            }
        })

        res.status(200).json({
            error: false,
            logs: z.array(ParsedLogValidator).parse(databaseLogs)
        })
    }
    catch (e) {
        handleError(e, res,
            [
                ZodErrorHandler,
                PrismaKnownRequestErrorHandler,
                ServerErrorHandler
            ]
        )
        logError(e, req)
    }
}))