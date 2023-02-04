import { voTest as test } from "@guidepup/playwright";
import { assert, record, setup } from "./utils";

const testUrl =
  "https://aria-at.netlify.app/tests/banner/reference/2021-10-24_135455/banner.setfocusbeforebanner";

test.describe("Banner", () => {
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

  ["banner", "link", "Top"].forEach((phrase) => {
    test(`Navigate forwards into a banner landmark | Control+Option+Right, then Control+Option+Right | Phrase: ${phrase}`, async ({
      voiceOver,
    }) => {
      await voiceOver.next();
      await voiceOver.next();

      assert({ voiceOver, phrase });
    });

    test(`Navigate forwards into a banner landmark | Control+Option+Command+L | Phrase ${phrase}`, async ({
      voiceOver,
    }) => {
      await voiceOver.perform(voiceOver.keyboardCommands.findNextLink);

      assert({ voiceOver, phrase });
    });
  });
});
