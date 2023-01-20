import { GenericErrorResponse, PrismaKnownRequestErrorHandler, ServerErrorHandler, ZodErrorHandler, handleError } from "@/services/errorHandling.js"
import { logError } from "@/utils/logging.js"
import { createController } from "@/utils/createController.js"
import { Response, Router } from "express"
import { z } from "zod"


export const satelliteController = Router()

// This route returns a list of the most recent [limit] logs.
const PostGetListRequestBodyValidator = z.object({
    limit: z.number().min(1).max(50)
})
type PostGetListResponseType = {
    error: false,
    logs: Array<unknown>
}
satelliteController.get('/getList', createController((req, res: Response<PostGetListResponseType | GenericErrorResponse>) => {
    try {
        const body = PostGetListRequestBodyValidator.parse(req.body)
        res.status(200).json({
            error: false,
            logs: []
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