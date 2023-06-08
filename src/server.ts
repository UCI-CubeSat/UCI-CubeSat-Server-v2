import { env } from "@/services/env.js";
import cors from "cors";
import express from "express";
import session from "express-session";
import passport from "passport";
import { authController } from "./controllers/auth.js";
import { satelliteController } from "./controllers/satellite.js";
import { kafkaRun } from "./services/kafka.js";

const expressApp = express();

// Top level middlewares
expressApp.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
  })
);

expressApp.use(session(config.session));
expressApp.use(passport.initialize());
expressApp.use(passport.session());
expressApp.use(express.urlencoded({ extended: false }));
expressApp.use(express.json());

// Attach routers
expressApp.use("/satellite", satelliteController);
expressApp.use("/auth", authController);

kafkaRun();

export default expressApp;
