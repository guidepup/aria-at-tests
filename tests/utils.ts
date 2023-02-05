import { macOSRecord, VoiceOver } from "@guidepup/guidepup";
import { voTest } from "@guidepup/playwright";
import { expect, Page } from "@playwright/test";
import { platform, release } from "os";
import { join } from "path";

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function record({
  test,
}: {
  test: typeof voTest;
}): Promise<() => void> {
  const { retry, title } = test.info();
  const directoryPath = title
    .replaceAll(/\s+/g, "_")
    .replaceAll(/[":<>|*?]/g, "_")
    .toLowerCase();
  const fileName = `test_${platform()}_${release()}_${retry}.mov`;
  const filePath = join("./recordings/", directoryPath, fileName);

  return macOSRecord(filePath);
}

export async function setup({
  page,
  testUrl,
}: {
  page: Page;
  testUrl: string;
}): Promise<void> {
  await page.goto(testUrl, { waitUntil: "load" });
  await delay(1000);
  await page.locator("body").focus();
}

export async function assert({
  phrase,
  voiceOver,
}: {
  phrase: string;
  voiceOver: VoiceOver;
}) {
  const spokenPhraseLog = await voiceOver.spokenPhraseLog();

  const startIndexFromEnd = [...spokenPhraseLog]
    .reverse()
    .findIndex((spokenPhrase) => spokenPhrase.includes("Run Test Setup"));

  const startIndex =
    startIndexFromEnd === -1
      ? 0
      : spokenPhraseLog.length - 1 - startIndexFromEnd;
  const testSpokenPhraseLog = spokenPhraseLog.slice(startIndex);

  const found = !!testSpokenPhraseLog.find((spokenPhrase) =>
    spokenPhrase.includes(phrase)
  );

  if (!found) {
    console.error(
      `Unable to find phrase "${phrase}" in spoken phrase log:\n\n${JSON.stringify(
        testSpokenPhraseLog,
        undefined,
        2
      )}\n\nFull spoken phrase log:\n\n${JSON.stringify(
        spokenPhraseLog,
        undefined,
        2
      )}`
    );
  }

  expect(found).toBeTruthy();
}
