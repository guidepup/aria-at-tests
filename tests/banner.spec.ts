import { expect } from "@playwright/test";
import { voTest as test } from "@guidepup/playwright";
import { record, setup } from "./setup";

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

    expect(voiceOver.spokenPhraseLog()).toContain("Top, link");
    expect(voiceOver.spokenPhraseLog()).toContain("banner");
  });

  test("Navigate forwards into a banner landmark [2]", async ({
    voiceOver,
  }) => {
    await voiceOver.perform(voiceOver.keyboard.commands.findNextLink);

    expect(voiceOver.spokenPhraseLog()).toContain("Top, link");
    // expect(voiceOver.spokenPhraseLog()).toContain("banner");
  });
});
