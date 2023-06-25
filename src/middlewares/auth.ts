import { GenericErrorResponse } from "@/error/index.js";
import { env } from "@/services/env.js";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

const decodedSchema = z.object({
  email: z.string(),
  subscribed: z.boolean(),
  ip: z.string(),
});

// TODO: Add logging to auth middleware
export const authMiddleware = (
  req: Request,
  res: Response<GenericErrorResponse>,
  next: NextFunction
) => {
  try {
    const body = z.object({ token: z.string() }).parse(req.body);
    const user = decodedSchema.parse(
      jwt.verify(body.token, env.SESSION_SECRET)
    );
    if (user.ip === req.ip) {
      next();
    } else {
      res.status(401).send({
        message:
          "There were inconsitencies with the token. Please login again.",
      });
    }
  } catch (e) {
    res.status(401).send({
      message: "Unauthorized access.",
    });
  }
};
