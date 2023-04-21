import { env } from "../services/env.js";
import fetch from "node-fetch";

const generateData = (message: string | undefined) => ({
  sender: {
    name: "UCI CubeSat",
    email: "team.ucicubesat@gmail.com",
  },
  to: [
    {
      email: "liaojy2@uci.edu",
      name: "Justin Liao",
    },
    {
      email: "athadipa@uci.edu",
      name: "Aishwarya Thadiparthi",
    },
  ],
  subject: "Hello world",
  htmlContent: `<html><head></head><body>Message: ${message}</p></body></html>`,
});

const testEmailSend = async (message: string | undefined) => {
  const res = await fetch("https://api.sendinblue.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": env.SENDINBLUE_APIKEY,
      "content-type": "application/json",
    },
    body: JSON.stringify(generateData(message)),
  });

  console.log(res);
};

export { testEmailSend };
