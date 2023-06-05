import { User } from "@prisma/client";
import fetch from "node-fetch";
import { env } from "./env.js";

type EmailBody = {
  sender: {
    name: string;
    email: string;
  };
  to: {
    email: string;
    name: string;
  }[];
  subject: string;
  htmlContent: string;
};

export const generateNotificationEmails = (
  message: string | undefined,
  users: User[]
) => {
  const emails = users.map(({ email }) => ({
    email,
    name: "UCI CubeSat Email Notification Subscriber",
  }));

  const emailContent =
    env.ENV === "production"
      ? `PRODUCTION<br />${message}`
      : `DEVELOPMENT<br />${message}`;

  return {
    sender: {
      name: "UCI CubeSat",
      email: "team.ucicubesat@gmail.com",
    },
    to: emails,
    subject: "Hello world",
    htmlContent: `<html><head></head><body>${emailContent}</p></body></html>`,
  };
};

export const sendEmail = async (body: EmailBody) => {
  try {
    await fetch(env.SENDINBLUE_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": env.SENDINBLUE_APIKEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.error(
      `Error sending email with message ${JSON.stringify(body)}: `,
      e
    );
  }
};
