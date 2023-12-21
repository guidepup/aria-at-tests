import { nvda, WindowsKeyCodes, WindowsModifiers } from "@guidepup/guidepup";
import { test } from "@playwright/test";
import { applicationNameMap } from "./applicationNameMap";

/**
 * These tests extend the default Playwright environment that launches the
 * browser with a running instance of the NVDA screen reader for Windows.
 *
 * A fresh started NVDA instance `nvda` is provided to each test.
 */
const nvdaTest = test.extend<{ nvda: typeof nvda }>({
  nvda: async ({ browserName, page }, use) => {
    try {
      const applicationName = applicationNameMap[browserName];

      if (!applicationName) {
        throw new Error(`Browser ${browserName} is not installed.`);
      }

      let nvdaStartRetryCount = 0;
      let error: Error;

      while (nvdaStartRetryCount < 3) {
        nvdaStartRetryCount++;

        try {
          await nvda.start();

          break;
        } catch (e) {
          error = e;

          try {
            await nvda.stop();
          } catch {
            // swallow error
          }
        }

        if (nvdaStartRetryCount === 3) {
          throw error;
        }
      }

      await page.goto("about:blank", { waitUntil: "load" });

      let applicationSwitchRetryCount = 0;

      while (applicationSwitchRetryCount < 10) {
        applicationSwitchRetryCount++;

        await nvda.perform({
          keyCode: [WindowsKeyCodes.Tab],
          modifiers: [WindowsModifiers.Alt],
        });

        const lastSpokenPhrase = await nvda.lastSpokenPhrase();

        if (lastSpokenPhrase.includes(applicationName)) {
          break;
        }
      }

      if (browserName === "chromium") {
        let mainPageFocusRetryCount = 0;

        // Get to the main page - sometimes focus can land on the address bar
        while (
          !(await nvda.lastSpokenPhrase()).includes("document") &&
          mainPageFocusRetryCount < 10
        ) {
          mainPageFocusRetryCount++;

          await nvda.press("F6");
        }
      } else if (browserName === "firefox") {
        // Force focus to somewhere in the web content
        await page.locator("body").first().focus();
      }

      // Make sure not in focus mode
      await nvda.perform(nvda.keyboardCommands.exitFocusMode);

      // Clear the log so clean for the actual test!
      await nvda.clearSpokenPhraseLog();

      await use(nvda);
    } finally {
      try {
        await nvda.stop();
      } catch {
        // swallow stop failure
      }
    }
  },
});

export { nvdaTest };
