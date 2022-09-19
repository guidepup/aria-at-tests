import { voTest as test } from "@guidepup/playwright";
import { record, setup } from "./setup";
import { assert } from "./assert";

const testUrl =
  "https://aria-at.netlify.app/tests/banner/reference/2021-10-24_135455/banner.setfocusbeforebanner";

test.describe("Banner", () => {
  let stopRecording;

  test.beforeEach(async ({ page, voiceOver }) => {
    stopRecording = await record({ test });
    await setup({ page, voiceOver, testUrl });
  });

  test.afterEach(() => {
    stopRecording();
  });

  test("Navigate forwards into a banner landmark [1]", async ({
    voiceOver,
  }) => {
    await voiceOver.next();
    await voiceOver.next();

    assert({ voiceOver, phrase: "Top" });
    assert({ voiceOver, phrase: "link" });
    assert({ voiceOver, phrase: "banner" });
  });

  test("Navigate forwards into a banner landmark [2]", async ({
    voiceOver,
  }) => {
    await voiceOver.perform(voiceOver.keyboard.commands.findNextLink);

    assert({ voiceOver, phrase: "Top" });
    assert({ voiceOver, phrase: "link" });
    // assert({ voiceOver, phrase: "banner" });
  });
});
