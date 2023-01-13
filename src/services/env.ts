import { z } from 'zod'

const env_schema = z.object({
    PORT: z.string().transform(Number),
})

export const env = env_schema.parse(process.env)