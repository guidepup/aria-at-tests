import { expect } from "@playwright/test";
import { voTest as test } from "@guidepup/playwright";
import { setup } from "./setup";

const testUrl =
  "https://aria-at.netlify.app/tests/banner/reference/2021-10-24_135455/banner.setfocusbeforebanner";

test.describe("Banner", () => {
  let stopRecording;

  test.beforeEach(async ({ page, voiceOver }) => {
    stopRecording = await setup({ page, voiceOver, test, testUrl });
  });

  test.afterEach(() => {
    stopRecording();
  });

  test("Navigate forwards into a banner landmark [1]", async ({
    voiceOver,
  }) => {
    await voiceOver.next();
    await voiceOver.next();

    expect(voiceOver.spokenPhraseLog().at(-1)).toContain("Top");
    expect(voiceOver.spokenPhraseLog().at(-1)).toContain("link");
    expect(voiceOver.spokenPhraseLog().at(-2)).toContain("banner");
  });

  test("Navigate forwards into a banner landmark [2]", async ({
    voiceOver,
  }) => {
    await voiceOver.perform(voiceOver.keyboard.commands.findNextLink);

    expect(voiceOver.spokenPhraseLog().at(-1)).toContain("Top");
    expect(voiceOver.spokenPhraseLog().at(-1)).toContain("link");
    // expect(voiceOver.spokenPhraseLog().at(-2)).toContain("banner");
  });
});
