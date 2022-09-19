import { expect } from "@playwright/test";
import { voTest as test } from "@guidepup/playwright";
import { record, setup } from "./setup";

const testUrl =
  "https://aria-at.netlify.app/tests/alert/reference/2022-4-8_144013/alert.setfocusonbutton";

test.describe("Alert", () => {
  let stopRecording;

  test.beforeEach(async ({ page, voiceOver }) => {
    stopRecording = await record({ test });
    await setup({ page, voiceOver, testUrl });
  });

  test.afterEach(() => {
    stopRecording();
  });

  test("Trigger an alert [1]", async ({ voiceOver }) => {
    await voiceOver.act();

    expect(voiceOver.spokenPhraseLog()).toContain("Hello");
    // expect(voiceOver.spokenPhraseLog()).toContain("alert");
  });

  test("Trigger an alert [2]", async ({ voiceOver }) => {
    await voiceOver.press("Space");

    expect(voiceOver.spokenPhraseLog()).toContain("Hello");
    // expect(voiceOver.spokenPhraseLog()).toContain("alert");
  });

  test("Trigger an alert [3]", async ({ voiceOver }) => {
    await voiceOver.press("Enter");

    expect(voiceOver.spokenPhraseLog()).toContain("Hello");
    // expect(voiceOver.spokenPhraseLog()).toContain("alert");
  });
});
