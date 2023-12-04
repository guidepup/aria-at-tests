import { devices, PlaywrightTestConfig } from "@playwright/test";
import { voConfig } from "@guidepup/playwright";

const config: PlaywrightTestConfig = {
  ...voConfig,
  reportSlowTests: null,
  fullyParallel: false,
  workers: 1,
  timeout: 5 * 60 * 1000,
  retries: 5,
  projects: [
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"], headless: false },
    },
  ],
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
};

export default config;
