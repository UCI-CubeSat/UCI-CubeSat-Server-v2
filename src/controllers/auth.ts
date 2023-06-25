import { samlConfig } from "@/config/auth.js";
import { RequestBodyError } from "@/error/custom/request.js";
import { ServerErrorHandler } from "@/error/handlers/generic.js";
import { RequestBodyErrorHandler } from "@/error/handlers/request.js";
import { GenericErrorResponse, handleError } from "@/error/index.js";
import { userSchema } from "@/models/user.js";
import { env } from "@/services/env.js";
import { encodeUser } from "@/utils/auth.js";
import { customErrorIfSafeParseError } from "@/utils/customError.js";
import { ensureResponse } from "@/utils/ensureResponse.js";
import { Response, Router } from "express";
import passport from "passport";
import { v4 } from "uuid";
import { z } from "zod";

export const authController = Router();

const tokenStore = new Map<string, string>();

authController.get(
  "/login",
  passport.authenticate("saml", samlConfig),
  (_req, res, _next) => {
    return res.redirect(`${env.FRONTEND_ORIGIN}${env.FRONTEND_BASE_ROUTE}/401`);
  }
);

authController.post(
  "/login/callback",
  passport.authenticate("saml", samlConfig),
  (req, res, _next) => {
    const potentialUser = req.user;
    const result = userSchema.safeParse(potentialUser);
    if (result.success) {
      const user = result.data;
      const tempId = v4();
      tokenStore.set(tempId + req.ip, encodeUser(user, req.ip));

      // User must redeem token from tokenStore within 10 seconds
      setTimeout(() => {
        tokenStore.delete(tempId + req.ip);
      }, 10000);

      res.redirect(
        `${env.FRONTEND_ORIGIN}${env.FRONTEND_BASE_ROUTE}login/${tempId}/`
      );
    } else {
      return res.redirect(
        `${env.FRONTEND_ORIGIN}${env.FRONTEND_BASE_ROUTE}/404`
      );
    }
  }
);

const GetTokenRequestSchema = z.object({
  tempId: z.string(),
});
type GetTokenResponseSchema = {
  token: string;
};

authController.post(
  "/get_token",
  ensureResponse(
    async (
      req,
      res: Response<GenericErrorResponse | GetTokenResponseSchema>
    ) => {
      try {
        const body = customErrorIfSafeParseError(
          GetTokenRequestSchema.safeParse(req.body),
          RequestBodyError
        );
        const token = tokenStore.get(body.tempId + req.ip);
        if (token) {
          tokenStore.delete(body.tempId + req.ip);
          res.send({
            token: token,
          });
        } else {
          res.status(401).send({
            message: "No token found.",
          });
        }
      } catch (e) {
        handleError(e, req, res, [RequestBodyErrorHandler, ServerErrorHandler]);
      }
    }
  )
);
