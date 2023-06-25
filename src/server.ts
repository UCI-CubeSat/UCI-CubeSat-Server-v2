import { samlConfig } from "@/config/auth.js";
import { getUserWithEmail } from "@/services/db.js";
import { env } from "@/services/env.js";
import { Strategy } from "@node-saml/passport-saml";
import cors from "cors";
import express from "express";
import passport from "passport";
import { z } from "zod";
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

expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: false }));
expressApp.use(passport.initialize());

passport.use(
  new Strategy(
    samlConfig,
    async (req, profile, done) => {
      const res = z.object({ email: z.string() }).safeParse(profile);

      if (res.success) {
        try {
          done(null, await getUserWithEmail(res.data.email));
        } catch (e) {
          done(e as Error, undefined);
        }
      } else {
        done(res.error, undefined);
      }
    },
    (req, profile, done) => {
      throw new Error("Currently not implemented/needed");
    }
  )
);

// Attach routers
expressApp.use("/satellite", satelliteController);
expressApp.use("/auth", authController);

kafkaRun();

export default expressApp;
