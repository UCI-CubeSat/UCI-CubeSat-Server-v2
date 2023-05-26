import { env } from "../services/env.js";
import { getUsersSubscribedToNotifications } from "../services/db.js";
import fetch from "node-fetch";

const generateData = async (message: string | undefined) => {
  const users = await getUsersSubscribedToNotifications();

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

const sendEmailNotifications = async (message: string | undefined) => {
  const body = await generateData(message);

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
    console.log(`Error sending email with message ${message}: `, e);
  }
};

export { generateData, sendEmailNotifications };
