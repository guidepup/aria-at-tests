import { voTest as test } from "@guidepup/playwright";
import { assert, record, setup } from "./utils";

test.describe("Alert", () => {
  let stopRecording;

  const testUrl =
    "https://aria-at.netlify.app/tests/alert/reference/2022-4-8_144013/alert.setfocusonbutton";

  const expectedPhrases = ["alert", "Hello"];

  test.beforeEach(async ({ page, voiceOver }) => {
    stopRecording = await record({ test });
    await setup({ page, testUrl });
    await page.locator("button", { hasText: "Run Test Setup" }).focus();
    await voiceOver.perform(
      voiceOver.keyboardCommands.performDefaultActionForItem
    );
  });

  test.afterEach(() => {
    stopRecording();
  });

  test.describe(`Trigger an alert | Control+Option+Space`, () => {
    test.beforeAll(async ({ voiceOver }) => {
      await voiceOver.perform(
        voiceOver.keyboardCommands.performDefaultActionForItem
      );
    });

    expectedPhrases.forEach((phrase) => {
      test(`Trigger an alert | Control+Option+Space | Phrase: ${phrase}`, ({
        voiceOver,
      }) => {
        assert({ voiceOver, phrase });
      });
    });
  });

  test.describe(`Trigger an alert | Space`, () => {
    test.beforeAll(async ({ voiceOver }) => {
      await voiceOver.press("Space");
    });

    expectedPhrases.forEach((phrase) => {
      test(`Trigger an alert | Space | Phrase: ${phrase}`, ({ voiceOver }) => {
        assert({ voiceOver, phrase });
      });
    });
  });

  test.describe(`Trigger an alert | Enter`, () => {
    test.beforeAll(async ({ voiceOver }) => {
      await voiceOver.press("Enter");
    });

    ["alert", "Hello"].forEach((phrase) => {
      test(`Trigger an alert | Enter | Phrase: ${phrase}`, ({ voiceOver }) => {
        assert({ voiceOver, phrase });
      });
    });
  });
});
