import { z } from "zod";

const env_schema = z.object({
  PORT: z.string().transform(Number),
  HOST_NAME: z.string(),
  FRONTEND_ORIGIN: z.string(),
  DATABASE_URL: z.string(),
  KAFKA_URL: z.string(),
  KAFKA_USERNAME: z.string(),
  KAFKA_PASSWORD: z.string(),
  SENDINBLUE_APIKEY: z.string(),
});

export const env = env_schema.parse(process.env);
