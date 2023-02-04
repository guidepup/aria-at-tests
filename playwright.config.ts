import { devices, PlaywrightTestConfig } from "@playwright/test";
import { voConfig } from "@guidepup/playwright";

const config: PlaywrightTestConfig = {
  ...voConfig,
  reportSlowTests: null,
  workers: 1,
  timeout: 2 * 60 * 1000,
  retries: 1,
  projects: [
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"], headless: false },
    },
  ],
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
};

export default config;
