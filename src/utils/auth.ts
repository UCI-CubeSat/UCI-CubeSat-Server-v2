import { env } from "@/services/env.js";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

export const encodeUser = (user: User, ip: string) => {
  return jwt.sign(
    {
      email: user.email,
      subscribed: user.subscribed,
      ip: ip,
    },
    env.SESSION_SECRET,
    { expiresIn: "1h" }
  );
};
