import { Page } from "@playwright/test";
import { delay } from "./delay";
import { Test } from "./types";
import { log } from "./log";
import { VoiceOverPlaywright, NVDAPlaywright } from "@guidepup/playwright";

const PAGE_LOAD_DELAY = 500;

export async function setup({
  hasSetupScript,
  mode,
  page,
  screenReader,
  setMode,
  testUrl,
}: {
  hasSetupScript: boolean;
  mode: Test["mode"];
  moveToSystemFocusCommand: unknown;
  page: Page;
  screenReader: VoiceOverPlaywright | NVDAPlaywright;
  setMode: ({
    mode,
    screenReader,
  }: {
    mode: Test["mode"];
    screenReader: VoiceOverPlaywright | NVDAPlaywright;
  }) => void | Promise<void>;
  testUrl: string;
}): Promise<void> {
  log(`Navigating to URL: "${testUrl}".`);

  await page.goto(testUrl, { waitUntil: "load" });
  await delay(PAGE_LOAD_DELAY);

  await screenReader.navigateToWebContent();

  if (hasSetupScript) {
    await page.goto(testUrl, { waitUntil: "load" });
    await delay(PAGE_LOAD_DELAY);

    log("Running test setup.");

    await screenReader.act();

    const lastSpokenPhrase = await screenReader.lastSpokenPhrase();

    log(`Screen reader output: "${lastSpokenPhrase}".`);
    log("Running test steps.");
  } else {
    log("No test setup configured.");
    log("Running test steps.");
  }

  await setMode({ mode, screenReader });
}
