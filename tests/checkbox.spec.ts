import { MacOSKeyCodes } from "@guidepup/guidepup";
import { voTest as test } from "@guidepup/playwright";
import { assert, record, setup } from "./utils";

test.describe("Checkbox", () => {
  let stopRecording;

  test.describe("Navigate to an unchecked checkbox", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/checkbox/reference/2020-11-23_175030/checkbox-1/checkbox-1.html";

    test.beforeEach(async ({ page, voiceOver }) => {
      stopRecording = await record({ test });
      await setup({ page, testUrl });
      await voiceOver.interact();
    });

    test.afterEach(() => {
      stopRecording();
    });

    ["checkbox", "Lettuce", "unticked"].forEach((phrase) => {
      test(`Navigate to an unchecked checkbox | Tab / Shift+Tab | Phrase: ${phrase}`, async ({
        voiceOver,
      }) => {
        await voiceOver.perform({ keyCode: MacOSKeyCodes.Tab });

        assert({ voiceOver, phrase });
      });

      test(`Navigate to an unchecked checkbox | Control+Option+Right / Ctrl+Option+Left | Phrase: ${phrase}`, async ({
        voiceOver,
      }) => {
        await voiceOver.next();
        await voiceOver.next();
        await voiceOver.next();

        assert({ voiceOver, phrase });
      });

      test(`Navigate to an unchecked checkbox | Control+Option+Command+J / Shift+Control+Option+Command+J | Phrase: ${phrase}`, async ({
        voiceOver,
      }) => {
        await voiceOver.perform(voiceOver.keyboardCommands.findNextControl);

        assert({ voiceOver, phrase });
      });
    });
  });

  test.describe("Navigate to an unchecked checkbox", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/checkbox/reference/2020-11-23_175030/checkbox-1/checkbox-1.checkfirstcheckbox";

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

    ["checkbox", "Lettuce", "ticked"].forEach((phrase) => {
      test(`Navigate to a checked checkbox | Tab / Shift+Tab | Phrase: ${phrase}`, async ({
        voiceOver,
      }) => {
        await voiceOver.perform({ keyCode: MacOSKeyCodes.Tab });

        assert({ voiceOver, phrase });
      });

      test(`Navigate to a checked checkbox | Control+Option+Right / Ctrl+Option+Left | Phrase: ${phrase}`, async ({
        voiceOver,
      }) => {
        await voiceOver.next();
        await voiceOver.next();
        await voiceOver.next();

        assert({ voiceOver, phrase });
      });

      test(`Navigate to a checked checkbox | Control+Option+Command+J / Shift+Control+Option+Command+J | Phrase: ${phrase}`, async ({
        voiceOver,
      }) => {
        await voiceOver.perform(voiceOver.keyboardCommands.findNextControl);

        assert({ voiceOver, phrase });
      });
    });
  });
});
