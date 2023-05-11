import { DatabaseServiceParamError } from '@/error/custom/database.js'
import { customErrorIfSafeParseError } from '@/utils/customError.js'
import { checkIfStartBeforeEnd } from '@/utils/date.js'
import {Log, PrismaClient} from '@prisma/client';
import { z } from 'zod'
import {EnumFilters} from '@/controllers/satellite.js';

export const prisma = new PrismaClient()

/**
 * Gets total log count from prisma
 */
export const getLogsCount = async () => {
    return prisma.log.count()
}

/**
 * Gets logs from database with timestamp greater than or equal to `start` and less than or equal to `end`.
 *
 * Will raise error if `start` is not before `end`.
 */
export const getLogsByTimeRange = async (start: number, end: number) => {
    checkIfStartBeforeEnd(start, end)

    return prisma.log.findMany({
        where: {
            timestamp: {
                gte: start,
                lte: end
            }
        },
        orderBy: [
            {
                timestamp: "desc"
            }
        ]
    })
}
/**
 * Gets `count` logs from database starting at and including `index`.
 *
 * Will raise error if `index` is not non-negative and `count` is not non-negative
 */
export const getLogsByOffset = async (index: number, count: number) => {
    // Check if index and count are both non-negative
    customErrorIfSafeParseError(z.number().min(0).safeParse(index), DatabaseServiceParamError)
    customErrorIfSafeParseError(z.number().min(0).safeParse(count), DatabaseServiceParamError)


    return await prisma.log.findMany({
        skip: index,
        take: count,
        orderBy: [
            {
                timestamp: "desc"
            }
        ]
    })
}


/**
 * Gets `count` log after the `cursor`
 *
 * Will raise error if `cursor` is not non-negative and `count` is not non-negative
 *
 * Includes the cursor provided
 */
export const getLogsByCursor = async (cursor: number, count: number) => {
    // Check if cursor and count are both non-negative
    customErrorIfSafeParseError(z.number().min(0).safeParse(cursor), DatabaseServiceParamError)
    customErrorIfSafeParseError(z.number().min(0).safeParse(count), DatabaseServiceParamError)

    return await prisma.log.findMany({
        cursor: {
            timestamp: cursor,
        },
        take: count,
        orderBy: [
            {
                timestamp: "desc"
            }
        ]
    })
}
/**
 * Returns count of logs before or after the `cursor`, depending on `direction`
 *
 * Will raise error if `cursor` is not non-negative
 *
 * "forward" returns count of older records (timestamp less than cursor, "backward" returns count of newer records
 * (timestamp greater than cursor)
 */
export const countLogsAroundCursor = async (cursor: number, direction: "forward" | "backward") => {
    // Check if cursor is non-negative
    customErrorIfSafeParseError(z.number().min(0).safeParse(cursor), DatabaseServiceParamError)

    return await prisma.log.count({
        where: {
            timestamp: {
                gt: direction === "backward" ? cursor : undefined,
                lt: direction === "forward" ? cursor : undefined
            }
        }
    })
}


// TODO: More efficient queries, if possible.
export const getLogsWithFilterAndTimeRange = async (start: number, end: number, fields?: string[], filters?: EnumFilters ) =>{

    // Creates object with all fields that user requests

    const selectedFields =
        fields?.reduce<Record<string, boolean>>((before, current: string ) => {
            before[current] = true;
            return before
        }, {})

    const whereClauseObject : Record<string, object> =
        {
            timestamp: {
                gte: start,
                lte: end
            }
        }

        if (filters) {
            for (const [satelliteEnum, satelliteEnumValue] of Object.entries(filters)) {
                if (satelliteEnum) {
                    whereClauseObject[satelliteEnum] = {
                        equals: satelliteEnumValue
                    }
                }
            }
        }

    return await prisma.log.findMany({
        where: whereClauseObject,
        orderBy: {
            timestamp: "desc"
        },
        select: selectedFields || undefined
    })
}
