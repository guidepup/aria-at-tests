import { Page } from "@playwright/test";
import { delay } from "./delay";
import { ScreenReader } from "@guidepup/guidepup";

const PAGE_LOAD_DELAY = 250;

export async function setup({
  page,
  screenReader,
  testUrl,
}: {
  page: Page;
  screenReader: ScreenReader;
  testUrl: string;
}): Promise<void> {
  console.log(`Navigating to URL: "${testUrl}".`);

  await page.goto(testUrl, { waitUntil: "load" });
  await delay(PAGE_LOAD_DELAY);

  console.log(`Running test setup.`);
  await screenReader.act();
}
