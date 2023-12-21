import { devices, PlaywrightTestConfig } from "@playwright/test";
import { voConfig } from "@guidepup/playwright";

const config: PlaywrightTestConfig = {
  ...voConfig,
  reportSlowTests: null,
  fullyParallel: false,
  workers: 1,
  timeout: 5 * 60 * 1000,
  retries: 1,
  projects: [
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"], headless: false, video: "on" },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"], headless: false, video: "on" },
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], headless: false, video: "on" },
    },
  ],
  reporter: process.env.CI
    ? [["github"], ["allure-playwright", { outputDir: "allure-results" }]]
    : "list",
};

export default config;
