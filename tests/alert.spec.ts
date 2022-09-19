import { assert } from "./assert";
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

    assert({ voiceOver, phrase: "Hello" });
    // assert({ voiceOver, phrase: "alert" });
  });

  test("Trigger an alert [2]", async ({ voiceOver }) => {
    await voiceOver.press("Space");

    assert({ voiceOver, phrase: "Hello" });
    // assert({ voiceOver, phrase: "alert" });
  });

  test("Trigger an alert [3]", async ({ voiceOver }) => {
    await voiceOver.press("Enter");

    assert({ voiceOver, phrase: "Hello" });
    // assert({ voiceOver, phrase: "alert" });
  });
});
