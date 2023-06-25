import { env } from "../services/env.js";

export const samlConfig = {
  session: false,
  cert: env.SAML_CERT,
  entryPoint: "https://shib-qa.service.uci.edu/idp/profile/SAML2/Redirect/SSO",
  issuer: "uci-cubesat-dashboard-server",
  protocol: `${env.SERVER_PROTOCOL}://`,
  host: env.SERVER_HOST_NAME_FOR_SAML,
  path: "auth/login/callback",
  decryptionPvk: env.SAML_DECRYPT_PRIVATE_KEY,
  digestAlgorithm: "sha256",
  attributeConsumingServiceIndex: env.SAML_SERVICE_INDEX,
  acceptedClockSkewMs: -1,
  passReqToCallback: true,
} as const;

export const samlOptions = {
  faliureFlash: true,
  failureRedirect: "/login",
} as const;
