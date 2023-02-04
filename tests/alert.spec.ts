import { voTest as test } from "@guidepup/playwright";
import { assert, record, setup } from "./utils";

const testUrl =
  "https://aria-at.netlify.app/tests/alert/reference/2022-4-8_144013/alert.setfocusonbutton";

test.describe("Alert", () => {
  let stopRecording;

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

  ["alert", "Hello"].forEach((phrase) => {
    test(`Trigger an alert | Control+Option+Space | Phrase: ${phrase}`, async ({
      voiceOver,
    }) => {
      await voiceOver.perform(
        voiceOver.keyboardCommands.performDefaultActionForItem
      );

      assert({ voiceOver, phrase });
    });

    test(`Trigger an alert | Space | Phrase: ${phrase}`, async ({
      voiceOver,
    }) => {
      await voiceOver.press("Space");

      assert({ voiceOver, phrase });
    });

    test(`Trigger an alert | Enter | Phrase: ${phrase}`, async ({
      voiceOver,
    }) => {
      await voiceOver.press("Enter");

      assert({ voiceOver, phrase });
    });
  });
});
