import { Kafka } from "kafkajs";
import { env } from "../services/env.js";

const kafka = new Kafka({
  brokers: [env.KAFKA_URL],
  sasl: {
    mechanism: "scram-sha-256",
    username: env.KAFKA_USERNAME,
    password: env.KAFKA_PASSWORD,
  },
  ssl: true,
});

const consumer = kafka.consumer({ groupId: "Downlink" });

await consumer.connect();
await consumer.subscribe({ topic: "Email-Notifs", fromBeginning: true });

export { consumer };
