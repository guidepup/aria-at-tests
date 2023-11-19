import { Page } from "@playwright/test";
import { delay } from "./delay";
import { ScreenReader, macOSActivate } from "@guidepup/guidepup";

const PAGE_LOAD_DELAY = 250;

export async function setup({
  applicationName,
  page,
  screenReader,
  testUrl,
}: {
  applicationName: string;
  page: Page;
  screenReader: ScreenReader;
  testUrl: string;
}): Promise<void> {
  await macOSActivate(applicationName);

  console.log(`Navigating to URL: "${testUrl}".`);

  await page.goto(testUrl, { waitUntil: "load" });
  await delay(PAGE_LOAD_DELAY);

  console.log(`Running test setup.`);
  await screenReader.act();
}
