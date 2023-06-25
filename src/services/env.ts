import { z } from "zod";

const env_schema = z.object({
    // Note that NODE_ENV is provided by the command ran
    ENV: z.enum(["production", "development"]),
    NODE_ENV: z.enum(["production", "development"]),
    PORT: z.string().transform(Number),
    HOST_NAME: z.string(),
    SERVER_PROTOCOL: z.enum(["https", "http"]),
    SERVER_HOST_NAME_FOR_SAML: z.string(),
    SAML_CERT: z.string(),
    SAML_SERVICE_INDEX: z.string(),
    SAML_DECRYPT_PRIVATE_KEY: z.string(),
    SAML_DECRYPT_PUBLIC_CERT: z.string(),
    SESSION_SECRET: z.string(),
    FRONTEND_BASE_ROUTE: z.string(),
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
