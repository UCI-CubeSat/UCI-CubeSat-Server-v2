import expressApp from "@/server.js";
import { getUsersSubscribedToNotifications } from "@/services/db.js";
import { generateNotificationEmails } from "@/services/email.js";
import { env } from "@/services/env.js";
import { Server } from "http";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Email Notification Service", () => {
  let server: Server;
  beforeEach(() => {
    server = expressApp.listen(env.PORT, env.HOST_NAME);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    server.close();
  });

  describe("getUsersSubscribedToNotifications", () => {
    it("returns an array of users", async () => {
      const users = await getUsersSubscribedToNotifications();
      expect(Array.isArray(users)).toBeTruthy();
      users.forEach((user) =>
        expect(typeof user.email === "string").toBeTruthy()
      );
    });
  });

  describe("generateData", () => {
    it("returns an object with sender and sendee data", async () => {
      const data = await generateNotificationEmails("test", await getUsersSubscribedToNotifications());
      expect(typeof data === "object").toBeTruthy();

      expect(typeof data.sender === "object").toBeTruthy();
      expect(typeof data.sender.name === "string").toBeTruthy();
      expect(typeof data.sender.email === "string").toBeTruthy();

      expect(Array.isArray(data.to)).toBeTruthy();
      data.to.forEach((user) => {
        expect(typeof user.email === "string").toBeTruthy();
        expect(typeof user.name === "string").toBeTruthy();
      });

      expect(typeof data.subject === "string").toBeTruthy();
      expect(typeof data.htmlContent === "string").toBeTruthy();
    });
  });
});
