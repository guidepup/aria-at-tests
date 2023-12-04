/* eslint-disable no-empty-pattern */
import {
  nvda,
  WindowsKeyCodes,
  WindowsModifiers,
} from "@guidepup/guidepup";
import { homedir } from "os";
import { join } from "path";
import { readdirSync } from "fs";
import { test } from "@playwright/test";

const BROWSER_INSTALLATION_DIRECTORY = join(
  homedir(),
  "AppData",
  "Local",
  "ms-playwright"
);

const CHROMIUM_PATH = join("chrome-win", "chrome.exe");
const FIREFOX_PATH = join("firefox", "firefox.exe");

const directories = readdirSync(BROWSER_INSTALLATION_DIRECTORY, {
  withFileTypes: true,
}).filter((item) => item.isDirectory());

const chromiumDirectory = directories
  .filter((directory) => directory.name.startsWith("chromium"))
  .sort(byLatestRevision)
  .at(0)?.name;

const firefoxDirectory = directories
  .filter((directory) => directory.name.startsWith("firefox"))
  .sort(byLatestRevision)
  .at(0)?.name;

function byLatestRevision(directoryA, directoryB) {
  const revisionA = directoryA.name.split("-").at(-1);
  const revisionB = directoryB.name.split("-").at(-1);

  return revisionB - revisionA;
}

const applicationNameMap = {
  chromium: chromiumDirectory
    ? {
        path: join(
          BROWSER_INSTALLATION_DIRECTORY,
          chromiumDirectory,
          CHROMIUM_PATH
        ),
        name: "Chromium",
      }
    : null,
  firefox: firefoxDirectory
    ? {
        path: join(
          BROWSER_INSTALLATION_DIRECTORY,
          firefoxDirectory,
          FIREFOX_PATH
        ),
        name: "Nightly",
      }
    : null,
};

/**
 * These tests extend the default Playwright environment that launches the
 * browser with a running instance of the NVDA screen reader for Windows.
 *
 * A fresh started NVDA instance `nvda` is provided to each test.
 */
const nvdaTest = test.extend<{ nvda: typeof nvda }>({
  nvda: async ({ browserName, page }, use) => {
    try {
      const application = applicationNameMap[browserName];

      if (!application) {
        throw new Error(`Browser ${browserName} is not installed.`);
      }

      await nvda.start();
      await page.goto("about:blank", { waitUntil: "load" });

      // eslint-disable-next-line no-constant-condition
      let applicationSwitchRetryCount = 0;

      while (applicationSwitchRetryCount < 10) {
        applicationSwitchRetryCount++;

        await nvda.perform({
          keyCode: [WindowsKeyCodes.Tab],
          modifiers: [WindowsModifiers.Alt],
        });

        const lastSpokenPhrase = await nvda.lastSpokenPhrase();

        if (lastSpokenPhrase.includes(application.name)) {
          break;
        }
      }

      if (browserName === "chromium") {
        let mainPageFocusRetryCount = 0;

        // Get to the main page - sometimes focus can land on the address bar
        while (!(await nvda.lastSpokenPhrase()).includes("document") && mainPageFocusRetryCount < 10) {
          mainPageFocusRetryCount++;

          await nvda.press("F6");
        }
      } else if (browserName === "firefox") {
        // Force focus to somewhere in the web content
        await page.locator("a").first().focus();
      }

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
