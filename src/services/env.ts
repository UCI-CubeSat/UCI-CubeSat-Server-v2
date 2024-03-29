import { z } from "zod";

const env_schema = z.object({
  // Env type the run command needs
  NODE_ENV: z.union([z.literal("production"), z.literal("development")]),
  // Env type that was provided
  ENV: z.union([z.literal("production"), z.literal("development")]),
  PORT: z.string().transform(Number),
  HOST_NAME: z.string(),
  FRONTEND_ORIGIN: z.string(),
  DATABASE_URL: z.string(),
  KAFKA_PORT: z.string(),
  KAFKA_URL: z.string(),
  KAFKA_USERNAME: z.string(),
  KAFKA_PASSWORD: z.string(),
  KAFKA_GROUPID: z.string(),
  KAFKA_TOPIC: z.string(),
  SENDINBLUE_APIKEY: z.string(),
  SENDINBLUE_URL: z.string(),
});

// Validate env and make sure the command used to start server matches env provided
const get_env = () => {
  const parsed_env = env_schema.parse(process.env);
  if (parsed_env.NODE_ENV !== parsed_env.ENV) {
    throw new Error(
      "NODE_ENV and ENV do not match. Check if the .env file is the correct one."
    );
  }
  return parsed_env;
};

export const env = get_env();
