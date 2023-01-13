import request from 'supertest';
import express, { Router } from 'express';
import { getExamples } from '@/controllers/example.js'
import { exampleModelValidator } from '@/models/example.js'
import { z } from 'zod'
import { describe, it, expect } from 'vitest'

const app = express();
app.use('/', Router().get('/', getExamples));

describe.concurrent("Example Controller", () => {
    it("returns whatever example service provides", async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200)
        expect(() => { z.array(exampleModelValidator).parse(res.body?.messages) }).not.toThrowError()
    })
})