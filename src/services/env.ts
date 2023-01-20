import { z } from 'zod'

const env_schema = z.object({
    PORT: z.string().transform(Number),
    HOST_NAME: z.string(),
    FRONTEND_ORIGIN: z.string()
})

export const env = env_schema.parse(process.env)