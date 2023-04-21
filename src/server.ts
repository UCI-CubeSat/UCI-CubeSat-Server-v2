import { env } from "@/services/env.js";
import cors from "cors";
import express from "express";
import { satelliteController } from "./controllers/satellite.js";
import { consumer } from "./services/kafka.js";
import { testEmailSend } from "./utils/emailNotifs.js";

const expressApp = express();

// Top level middlewares
expressApp.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
  })
);
expressApp.use(express.json());

// Attach routers
expressApp.use("/satellite", satelliteController);

await consumer.run({
  eachMessage: async (payload) => {
    const { topic, partition, message } = payload;
    console.log({
      key: message?.key?.toString(),
      value: message?.value?.toString(),
      headers: message.headers,
    });

    // send email
    testEmailSend(message?.value?.toString());
  },
});

export default expressApp;
