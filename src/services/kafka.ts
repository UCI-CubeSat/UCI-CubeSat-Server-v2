import { getUsersSubscribedToNotifications } from "@/services/db.js";
import { generateNotificationEmails, sendEmail } from "@/services/email.js";
import { Kafka } from "kafkajs";
import { env } from "../services/env.js";

const kafka = new Kafka({
  brokers: [`${env.KAFKA_URL}:${env.KAFKA_PORT}`],
  sasl: {
    mechanism: "scram-sha-256",
    username: env.KAFKA_USERNAME,
    password: env.KAFKA_PASSWORD,
  },
  ssl: true,
});

const consumer = kafka.consumer({ groupId: env.KAFKA_GROUPID });

const kafkaRun = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: env.KAFKA_TOPIC, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }) => {
        console.log(`received message: ${message.value?.toString()}`);

        // send email
        const usersSubscribed = await getUsersSubscribedToNotifications()
        const emailBodies = generateNotificationEmails(message.value?.toString(), usersSubscribed)
        sendEmail(emailBodies);
      },
    });

    console.log("Successfully subscribed to Kafka topic");
  } catch (e) {
    console.log("Error connecting to Kafka topic: ", e);
  }
};

export { kafkaRun };

