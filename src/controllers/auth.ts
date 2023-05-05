import { env } from "@/services/env.js";
import { Router } from "express";
import passport from 'passport';

export const authController = Router()

authController.post('/login', passport.authenticate("saml", config.saml.options), (_req, res, _next) => {
    return res.redirect(`${env.FRONTEND_ORIGIN}${env.FRONTEND_BASE_ROUTE}`);
})

authController.post('/login/callback', passport.authenticate("saml", config.saml.options), (_req, res, _next) => {
    return res.redirect(`${env.FRONTEND_ORIGIN}${env.FRONTEND_BASE_ROUTE}`);
})


authController.post('/me', (req, res, _next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    } else {
        const { user } = req;
        return res.status(200).json({ user });
    }
})