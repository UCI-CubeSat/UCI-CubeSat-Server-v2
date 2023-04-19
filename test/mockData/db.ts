import { Log, PrismaPromise } from "@prisma/client"
import { sampleLogs } from "./log.js"

export const mockFindMany = () => new Promise((resolve, reject) => {
    resolve(sampleLogs)
}) as PrismaPromise<Array<Log>>

export const mockFindManyFail = () => new Promise((resolve, reject) => {
    reject(new Error("Random Error"))
}) as PrismaPromise<Array<Log>>