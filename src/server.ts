import { env } from "@/services/env.js";
import cors from "cors";
import express from "express";
import { satelliteController } from "./controllers/satellite.js";
import { kafkaRun } from "./services/kafka.js";

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

kafkaRun();

export default expressApp;
