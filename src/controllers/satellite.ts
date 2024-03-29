import { RequestBodyError } from '@/error/custom/request.js'
import { DatabaseDataErrorHandler, DatabaseServiceParamErrorHandler, PrismaKnownRequestErrorHandler } from '@/error/handlers/database.js'
import { ServerErrorHandler } from '@/error/handlers/generic.js'
import { RequestBodyErrorHandler, StartNotBeforeEndErrorHandler } from '@/error/handlers/request.js'
import { GenericErrorResponse, handleError } from '@/error/index.js'
import { countLogsAroundCursor, getLogsByCursor, getLogsByOffset, getLogsByTimeRange } from '@/services/db.js'
import { customErrorIfSafeParseError } from "@/utils/customError.js"
import { ensureResponse } from "@/utils/ensureResponse.js"
import { Log } from '@prisma/client'
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
export type PostRangeResBody = {
    logs: Log[]
}

satelliteController.post('/by_time_range', ensureResponse(async (req, res: Response<PostRangeResBody | GenericErrorResponse>) => {
    try {
        const body = customErrorIfSafeParseError(PostByRangeReqBodyValidator.safeParse(req.body), RequestBodyError)
        const databaseLogs = await getLogsByTimeRange(body.start, body.end)
        res.status(200).json({
            logs: databaseLogs
        })
    }
    catch (e) {
        handleError(e, req, res,
            [
                RequestBodyErrorHandler,
                StartNotBeforeEndErrorHandler,
                PrismaKnownRequestErrorHandler,
                DatabaseDataErrorHandler,
                ServerErrorHandler
            ]
        )
    }
}))


export const PostOffsetReqBodyValidator = z.object({
    pageNo: z.number().min(1),
    count: z.number().min(1),
})

export type PostOffsetResBody = {
    logs: Log[],
    numLogsAfter: number,
    numLogsBefore: number

}

// TODO: Handle error cases where databaseLogs is an empty array
satelliteController.post('/by_offset', ensureResponse(async (req, res: Response<PostOffsetResBody | GenericErrorResponse>) => {
    try {
        const body = customErrorIfSafeParseError(PostOffsetReqBodyValidator.safeParse(req.body), RequestBodyError)
        const databaseLogs = await getLogsByOffset((body.pageNo - 1) * body.count, body.count)
        res.status(200).send({
            logs: databaseLogs,
            numLogsAfter: await countLogsAroundCursor(databaseLogs[databaseLogs.length - 1].timestamp, "forward"),
            numLogsBefore: await countLogsAroundCursor(databaseLogs[0].timestamp, "backward")
        })
    }
    catch (e) {
        handleError(e, req, res,
            [
                RequestBodyErrorHandler,
                DatabaseServiceParamErrorHandler,
                PrismaKnownRequestErrorHandler,
                DatabaseDataErrorHandler,
                ServerErrorHandler
            ]
        )
    }
}))


// TODO: Currently, this API is not in use, but will be used later
export const PostCursorReqBodyValidator = z.object({
    cursor: z.number().min(0), // Cursor log is always included
    count: z.number().min(1),
})
// TODO: Have endpoint return cursor for next and prev as well
export type PostPaginatedResBody = {
    logs: Log[]
}
satelliteController.post('/by_cursor', ensureResponse(async (req, res: Response<PostPaginatedResBody | GenericErrorResponse>) => {
    try {
        const body = customErrorIfSafeParseError(PostCursorReqBodyValidator.safeParse(req.body), RequestBodyError)
        const databaseLogs = await getLogsByCursor(body.cursor, body.count)
        res.status(200).send({
            logs: databaseLogs,
            // numLogsAfter: await countLogsAroundCursor(databaseLogs[databaseLogs.length - 1].timestamp, "forward"),
            // numLogsBefore: await countLogsAroundCursor(databaseLogs[0].timestamp, "backward")
        })
    }
    catch (e) {
        handleError(e, req, res,
            [
                RequestBodyErrorHandler,
                DatabaseServiceParamErrorHandler,
                PrismaKnownRequestErrorHandler,
                DatabaseDataErrorHandler,
                ServerErrorHandler
            ]
        )
    }
}))