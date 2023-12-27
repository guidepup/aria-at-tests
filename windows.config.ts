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
      name: "firefox",
      use: { ...devices["Desktop Firefox"], headless: false },
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], headless: false },
    },
  ],
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
};

export default config;
