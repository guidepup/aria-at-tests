import { expect } from "@playwright/test";

export function assert({ voiceOver, phrase, range = 2 }) {
  const acceptableSpokenPhraseLog = voiceOver
    .spokenPhraseLog()
    .slice(-1 * range);

  const found = !!acceptableSpokenPhraseLog.find((spokenPhrase) =>
    spokenPhrase.includes(phrase)
  );

  if (!found) {
    console.error(
      `Unable to find phrase "${phrase}" in spoken phrase log:\n\n${JSON.stringify(
        acceptableSpokenPhraseLog,
        undefined,
        2
      )}`
    );
  }

  expect(found).toBeTruthy();
}
