import { defineConfig, devices } from "@playwright/test";

const PORT = 47230;
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL: BASE_URL, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Set BASE_URL to run the same checks against the deployed site.
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run build:site && npm run preview:site",
        url: BASE_URL,
        reuseExistingServer: false,
        timeout: 120_000,
      },
});
