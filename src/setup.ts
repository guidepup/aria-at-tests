import { Page } from "@playwright/test";
import { delay } from "./delay";
import { ScreenReader } from "@guidepup/guidepup";

const PAGE_LOAD_DELAY = 250;

export async function setup({
  hasSetupScript,
  moveToSystemFocusCommand,
  page,
  screenReader,
  testUrl,
}: {
  hasSetupScript: boolean;
  moveToSystemFocusCommand: unknown;
  page: Page;
  screenReader: ScreenReader;
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
}
