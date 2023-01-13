import { z } from 'zod'

export const exampleModelValidator = z.object({
    message: z.string()
})

export type exampleModel = z.infer<typeof exampleModelValidator>