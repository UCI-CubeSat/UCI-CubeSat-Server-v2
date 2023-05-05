import { env } from "@/services/env.js";
import fetch from "node-fetch";

const messages = ["hi", "these", "are", "some", "random", "messages"];

console.log(
  `Attempting to produce messages in ${env.ENV} kafka topic with mock data.`
);
try {
  const results = messages.map(
    async (message) =>
      await fetch(`https://${env.KAFKA_URL}/produce/Email-Notifs/${message}`, {
        method: "GET",
        headers: {
          Authorization: `Basic ${env.KAFKA_USERNAME}:${env.KAFKA_PASSWORD}`,
        },
      })
  );
  console.log(results);
  console.log("Mock kafka data has succesfully produced!");
} catch (e) {
  console.error("There was an issue in producing mock data:", e);
}
