import { ScreenReader } from "@guidepup/guidepup";
import { voTest } from "@guidepup/playwright";
import { expect } from "@playwright/test";

export async function assert({
  assertion,
  screenReader,
  test,
}: {
  assertion: string;
  screenReader: ScreenReader;
  test: typeof voTest;
}) {
  const phrase = assertion.match(/'([^']+)'/)?.[1];

  if (!phrase) {
    const warning = `Unable to perform assertion: "${assertion}"`;

    console.warn(warning);

    test.info().annotations.push({
      type: "issue",
      description: warning,
    });

    return;
  }

  console.log(`Performing assertion: "${assertion}"`);

  const spokenPhraseLog = await screenReader.spokenPhraseLog();

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
    console.log(
      `Assertion "${assertion}" failed. Unable to find phrase "${phrase}" in spoken phrase log.`
    );
  } else {
    console.log(`Assertion "${assertion}" succeeded.`);
  }

  expect(found).toBeTruthy();
}
