import { Page } from "@playwright/test";
import { delay } from "./delay";
import { ScreenReader } from "@guidepup/guidepup";
import { Test } from "./types";

const PAGE_LOAD_DELAY = 250;

export async function setup({
  hasSetupScript,
  mode,
  moveToSystemFocusCommand,
  page,
  screenReader,
  setMode,
  testUrl,
}: {
  hasSetupScript: boolean;
  mode: Test["mode"];
  moveToSystemFocusCommand: unknown;
  page: Page;
  screenReader: ScreenReader;
  setMode: ({
    mode,
    screenReader,
  }: {
    mode: Test["mode"];
    screenReader: ScreenReader;
  }) => void | Promise<void>;
  testUrl: string;
}): Promise<void> {
  console.log(`Navigating to URL: "${testUrl}".`);

  await page.goto(testUrl, { waitUntil: "load" });
  await delay(PAGE_LOAD_DELAY);

  await screenReader.perform(moveToSystemFocusCommand);
  await screenReader.clearSpokenPhraseLog();
  await screenReader.clearItemTextLog();

  if (hasSetupScript) {
    console.log(`Running test setup.`);

    await screenReader.act();

    const lastSpokenPhrase = await screenReader.lastSpokenPhrase();
    console.log(`Screen reader output: "${lastSpokenPhrase}".`);

    console.log(`Running test steps.`);
  } else {
    console.log(`No test setup configured. Running test steps.`);
  }

  await setMode({ mode, screenReader });
}
