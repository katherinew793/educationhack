import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  use: { baseURL: "http://localhost:3000", channel: "chrome", headless: true },
  workers: 1,
  reporter: "list",
  timeout: 60000,
});
