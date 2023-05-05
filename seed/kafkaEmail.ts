import { env } from "@/services/env.js";
import fetch from "node-fetch";

const messages = ["hi", "these", "are", "some", "random", "messages"];

console.log(
  `Attempting to produce messages in ${env.ENV} kafka topic with mock data.`
);
try {
  const results = await Promise.all(
    messages.map(
      async (message) =>
        await fetch(
          `https://${env.KAFKA_URL}/produce/${env.KAFKA_TOPIC}/${message}`,
          {
            method: "GET",
            headers: {
              Authorization:
                "Basic " +
                Buffer.from(
                  `${env.KAFKA_USERNAME}:${env.KAFKA_PASSWORD}`
                ).toString("base64"),
            },
          }
        )
    )
  );

  console.log("Mock kafka data has succesfully produced!");
} catch (e) {
  console.error("There was an issue in producing mock data:", e);
}
