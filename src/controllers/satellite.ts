import { ParsedLogValidator } from '@/models/logs.js'
import { countLogsAroundCursor, getLogsByCursor, getLogsByOffset, getLogsByTimeRange } from '@/services/db.js'
import { DatabaseDataError, DatabaseDataErrorHandler, DatabaseServiceParamErrorHandler, GenericErrorResponse, PrismaKnownRequestErrorHandler, RequestBodyError, RequestBodyErrorHandler, ServerErrorHandler, StartNotBeforeEndErrorHandler, handleError } from "@/services/errorHandling.js"
import { createController } from "@/utils/createController.js"
import { customErrorIfSafeParseError } from "@/utils/customError.js"
import { logError } from "@/utils/logging.js"
import { Response, Router } from "express"
import { z } from "zod"

export const satelliteController = Router()

/**
 * start: Start time (represented as seconds from UNIX epoch) for logs 
 * end: End time (represented as seconds from UNIX epoch) for logs 
 */
export const PostByRangeReqBodyValidator = z.object({
    start: z.number().min(1),
    end: z.number().min(1)
})
export const PostByRangeResBodyValidator = z.object({
    logs: z.array(ParsedLogValidator)
})
type PostLogListResBody = z.infer<typeof PostByRangeResBodyValidator>
satelliteController.post('/by_time_range', createController(async (req, res: Response<PostLogListResBody | GenericErrorResponse>) => {
    try {
        const body = customErrorIfSafeParseError(PostByRangeReqBodyValidator.safeParse(req.body), RequestBodyError)
        const databaseLogs = await getLogsByTimeRange(body.start, body.end)
        res.status(200).json({
            logs: customErrorIfSafeParseError(z.array(ParsedLogValidator).safeParse(databaseLogs), DatabaseDataError)
        })
    }
    catch (e) {
        handleError(e, res,
            [
                RequestBodyErrorHandler,
                StartNotBeforeEndErrorHandler,
                PrismaKnownRequestErrorHandler,
                DatabaseDataErrorHandler,
                ServerErrorHandler
            ]
        )
        logError(e, req)
    }
}))
/*
Frontend provides 2 possible cases:
    index: number (position of first log to be returned)
    count: number of logs wanted

    or

    cursor: timestamp of log for cursor
    skip: boolean whether or not to skip the cursor value
    count: number of logs wanted

    values returned:
    cursorForPrev: can be null if no prev. If there is prev, do not use skip
    cursorForNext: can be null if no next. If there is next, use skip,
    data: list of logs
*/
export const PostPaginatedReqBodyValidator = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("offset"),
        index: z.number().min(0), // Indexed log is always included
        count: z.number().min(1),
    }),
    z.object({
        type: z.literal("cursor"),
        cursor: z.number().min(0), // Cursor log is never provided
        count: z.number().min(1),
        direction: z.enum(["forward", "backward"])
    })
])
export const PostPaginatedResBodyValidator = z.object({
    logs: z.array(ParsedLogValidator),
    numLogsBefore: z.number(),
    numLogsAfter: z.number()
})
type PostPaginatedResBody = z.infer<typeof PostPaginatedResBodyValidator>
satelliteController.post('/paginated', createController(async (req, res: Response<PostPaginatedResBody | GenericErrorResponse>) => {
    try {
        const body = customErrorIfSafeParseError(PostPaginatedReqBodyValidator.safeParse(req.body), RequestBodyError)
        const databaseLogs = body.type === "cursor" ?
            await getLogsByCursor(body.cursor, body.count, body.direction)
            :
            await getLogsByOffset(body.index, body.count)



        res.status(200).send({
            logs: customErrorIfSafeParseError(z.array(ParsedLogValidator).safeParse(databaseLogs), DatabaseDataError),
            numLogsAfter: await countLogsAroundCursor(databaseLogs[databaseLogs.length - 1].timestamp, "forward"),
            numLogsBefore: await countLogsAroundCursor(databaseLogs[0].timestamp, "backward")
        })
    }
    catch (e) {
        handleError(e, res,
            [
                RequestBodyErrorHandler,
                DatabaseServiceParamErrorHandler,
                PrismaKnownRequestErrorHandler,
                DatabaseDataErrorHandler,
                ServerErrorHandler
            ]
        )
        logError(e, req)
    }
}))