import { voTest as test } from "@guidepup/playwright";
import { assert, record, setup } from "./utils";

test.describe("Banner", () => {
  let stopRecording;

  const testUrl =
    "https://aria-at.netlify.app/tests/banner/reference/2021-10-24_135455/banner.setfocusbeforebanner";

  const expectedPhrases = ["banner", "link", "Top"];

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

  test.describe("Navigate forwards into a banner landmark | Control+Option+Right, then Control+Option+Right", () => {
    test.beforeEach(async ({ voiceOver }) => {
      await voiceOver.next();
      await voiceOver.next();
    });

    expectedPhrases.forEach((phrase) => {
      test(`Navigate forwards into a banner landmark | Control+Option+Right, then Control+Option+Right | Phrase: ${phrase}`, async ({
        voiceOver,
      }) => {
        assert({ voiceOver, phrase });
      });
    });
  });

  test.describe("Navigate forwards into a banner landmark | Control+Option+Command+L", () => {
    test.beforeEach(async ({ voiceOver }) => {
      await voiceOver.perform(voiceOver.keyboardCommands.findNextLink);
    });

    expectedPhrases.forEach((phrase) => {
      test(`Navigate forwards into a banner landmark | Control+Option+Command+L | Phrase ${phrase}`, async ({
        voiceOver,
      }) => {
        assert({ voiceOver, phrase });
      });
    });
  });
});
