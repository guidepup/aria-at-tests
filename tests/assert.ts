import { expect } from "@playwright/test";

export function assert({ voiceOver, phrase }) {
  const spokenPhraseLog = voiceOver.spokenPhraseLog();
  const startIndex = spokenPhraseLog.findLastIndex((spokenPhrase) =>
    spokenPhrase.includes("Run Test Setup")
  );
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
