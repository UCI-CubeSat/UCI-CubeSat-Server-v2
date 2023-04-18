import { PostByRangeResBodyValidator } from '@/controllers/satellite.js'
import { GenericErrorResponseValidator } from '@/error/index.js'
import expressApp from '@/server.js'
import { prisma } from '@/services/db.js'
import { env } from '@/services/env.js'
import { errorMessages } from '@/utils/errorMessages.js'
import { Server } from 'http'
import request from 'supertest'
import { mockFindMany, mockFindManyFail } from 'test/mockData/db.js'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'



describe('Satellite Controller', () => {
    let server: Server
    beforeEach(() => {
        server = expressApp.listen(env.PORT, env.HOST_NAME)
    })

    afterEach(() => {
        vi.restoreAllMocks()
        server.close()
    })

    describe('by_time_range', () => {
        it('returns logs when database provides them', async () => {
            const mock = vi.spyOn(prisma.log, "findMany").mockImplementationOnce(mockFindMany)
            const response = await request(server).post('/satellite/by_time_range').send({
                start: 1,
                end: 10
            })
            expect(mock).toHaveBeenCalledOnce()
            expect(() => PostByRangeResBodyValidator.parse(response.body)).not.toThrow()
        })

        it('returns an error when start is invalid', async () => {
            const mock = vi.spyOn(prisma.log, "findMany").mockImplementationOnce(mockFindMany)
            const response = await request(server).post('/satellite/by_time_range').send({
                start: -1,
                end: 10
            })
            expect(mock).not.toBeCalled()
            expect(response.status).toEqual(400)
            expect(() => GenericErrorResponseValidator.parse(response.body)).not.toThrow()
            expect(response?.body?.message).toEqual(errorMessages[400])
        })

        it('returns an error when database throws error', async () => {
            const mock = vi.spyOn(prisma.log, "findMany").mockImplementationOnce(mockFindManyFail)
            const response = await request(server).post('/satellite/by_time_range').send({
                start: 1,
                end: 10
            })
            expect(mock).toHaveBeenCalledOnce()
            expect(response.status).toEqual(500)
            expect(() => GenericErrorResponseValidator.parse(response.body)).not.toThrow()
            expect(response?.body?.message).toEqual(errorMessages[500])
        })
    })

    describe('by_offset', () => {
        it('returns logs when database provides them', async () => {
            const mock = vi.spyOn(prisma.log, "findMany").mockImplementationOnce(mockFindMany)
            const response = await request(server).post('/satellite/by_offset').send({
                pageNo: 1,
                count: 2
            })
            expect(mock).toHaveBeenCalledOnce()
            expect(() => PostByRangeResBodyValidator.parse(response.body)).not.toThrow()
        })

        it('returns an error when pageNo is invalid', async () => {
            const mock = vi.spyOn(prisma.log, "findMany").mockImplementationOnce(mockFindMany)
            const response = await request(server).post('/satellite/by_offset').send({
                pageNo: 0,
                count: 2
            })
            expect(mock).not.toBeCalled()
            expect(response.status).toEqual(400)
            expect(() => GenericErrorResponseValidator.parse(response.body)).not.toThrow()
            expect(response?.body?.message).toEqual(errorMessages[400])
        })

        it('returns an error when count is invalid', async () => {
            const mock = vi.spyOn(prisma.log, "findMany").mockImplementationOnce(mockFindMany)
            const response = await request(server).post('/satellite/by_offset').send({
                pageNo: 1,
                count: 0
            })
            expect(mock).not.toBeCalled()
            expect(response.status).toEqual(400)
            expect(() => GenericErrorResponseValidator.parse(response.body)).not.toThrow()
            expect(response?.body?.message).toEqual(errorMessages[400])
        })

        it('returns an error when database throws error', async () => {
            const mock = vi.spyOn(prisma.log, "findMany").mockImplementationOnce(mockFindManyFail)
            const response = await request(server).post('/satellite/by_offset').send({
                pageNo: 1,
                count: 2
            })
            expect(mock).toHaveBeenCalledOnce()
            expect(response.status).toEqual(500)
            expect(() => GenericErrorResponseValidator.parse(response.body)).not.toThrow()
            expect(response?.body?.message).toEqual(errorMessages[500])
        })
    })


})

