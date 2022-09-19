import { assert } from "./assert";
import { voTest as test } from "@guidepup/playwright";
import { record, setup } from "./setup";

test.describe("Breadcrumb", () => {
  let stopRecording;

  test.describe("Navigate to the first breadcrumb link", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/breadcrumb/reference/2022-8-2_132648/index.setfocusbeforefirstbreadcrumblink";

    test.beforeEach(async ({ page, voiceOver }) => {
      stopRecording = await record({ test });
      await setup({ page, voiceOver, testUrl });
    });

    test.afterEach(() => {
      stopRecording();
    });

    test("Navigate to the first breadcrumb link [1]", async ({ voiceOver }) => {
      await voiceOver.next();
      await voiceOver.next();
      await voiceOver.next();

      assert({ voiceOver, phrase: "navigation" });
      assert({ voiceOver, phrase: "list" });
      assert({ voiceOver, phrase: "4" });
      assert({ voiceOver, phrase: "link" });
      assert({ voiceOver, phrase: "WAI-ARIA Authoring Practices" });
    });

    test("Navigate to the first breadcrumb link [2]", async ({ voiceOver }) => {
      await voiceOver.perform(voiceOver.keyboard.commands.findNextLink);

      // assert({ voiceOver, phrase: "navigation" });
      // assert({ voiceOver, phrase: "list" });
      // assert({ voiceOver, phrase: "4" });
      assert({ voiceOver, phrase: "link" });
      assert({ voiceOver, phrase: "WAI-ARIA Authoring Practices" });
    });
  });

  test.describe("Navigate to the last breadcrumb link", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/breadcrumb/reference/2022-8-2_132648/index.setfocusafterlastbreadcrumblink";

    test.beforeEach(async ({ page, voiceOver }) => {
      stopRecording = await record({ test });
      await setup({ page, voiceOver, testUrl });
    });

    test.afterEach(() => {
      stopRecording();
    });

    test("Navigate to the last breadcrumb link [1]", async ({ voiceOver }) => {
      await voiceOver.previous();
      await voiceOver.previous();
      await voiceOver.previous();

      assert({ voiceOver, phrase: "navigation" });
      assert({ voiceOver, phrase: "Breadcrumb" });
      assert({ voiceOver, phrase: "list" });
      assert({ voiceOver, phrase: "4" });
      assert({ voiceOver, phrase: "link" });
      assert({ voiceOver, phrase: "Breadcrumb Example" });
      assert({ voiceOver, phrase: "current page" });
    });

    test("Navigate to the last breadcrumb link [2]", async ({ voiceOver }) => {
      await voiceOver.perform(voiceOver.keyboard.commands.findPreviousLink);

      // assert({ voiceOver, phrase: "navigation" });
      // assert({ voiceOver, phrase: "Breadcrumb" });
      // assert({ voiceOver, phrase: "list" });
      // assert({ voiceOver, phrase: "4" });
      assert({ voiceOver, phrase: "link" });
      assert({ voiceOver, phrase: "Breadcrumb Example" });
      assert({ voiceOver, phrase: "current page" });
    });
  });

  test.describe("Read information about a breadcrumb link", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/breadcrumb/reference/2022-8-2_132648/index.setfocusonlastbreadcrumblink";

    test.beforeEach(async ({ page, voiceOver }) => {
      stopRecording = await record({ test });
      await setup({ page, voiceOver, testUrl });
    });

    test.afterEach(() => {
      stopRecording();
    });

    test("Read information about a breadcrumb link [1]", async ({
      voiceOver,
    }) => {
      await voiceOver.perform(voiceOver.keyboard.commands.describeItem);

      assert({ voiceOver, phrase: "link" });
      assert({ voiceOver, phrase: "Breadcrumb Example" });
      assert({ voiceOver, phrase: "current page" });
    });

    test("Read information about a breadcrumb link [2]", async ({
      voiceOver,
    }) => {
      await voiceOver.perform(
        voiceOver.keyboard.commands.describeItemWithKeyboardFocus
      );

      assert({ voiceOver, phrase: "link" });
      assert({ voiceOver, phrase: "Breadcrumb Example" });
      assert({ voiceOver, phrase: "current page" });
    });
  });

  test.describe("Navigate forwards out of the Breadcrumb navigation landmark", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/breadcrumb/reference/2022-8-2_132648/index.setfocusonlastbreadcrumblink";

    test.beforeEach(async ({ page, voiceOver }) => {
      stopRecording = await record({ test });
      await setup({ page, voiceOver, testUrl });
    });

    test.afterEach(() => {
      stopRecording();
    });

    test("Navigate forwards out of the Breadcrumb navigation landmark [1]", async ({
      voiceOver,
    }) => {
      await voiceOver.next();
      await voiceOver.next();
      await voiceOver.next();

      assert({ voiceOver, phrase: "navigation" });
      assert({ voiceOver, phrase: "list" });
      assert({ voiceOver, phrase: "link" });
      assert({ voiceOver, phrase: "Navigate backwards from here" });
    });

    test("Navigate forwards out of the Breadcrumb navigation landmark [2]", async ({
      voiceOver,
    }) => {
      await voiceOver.perform(voiceOver.keyboard.commands.findNextLink);

      // assert({ voiceOver, phrase: "navigation" });
      // assert({ voiceOver, phrase: "list" });
      assert({ voiceOver, phrase: "link" });
      assert({ voiceOver, phrase: "Navigate backwards from here" });
    });
  });

  test.describe("Navigate backwards out of the Breadcrumb navigation landmark", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/breadcrumb/reference/2022-8-2_132648/index.setfocusonfirstbreadcrumblink";

    test.beforeEach(async ({ page, voiceOver }) => {
      stopRecording = await record({ test });
      await setup({ page, voiceOver, testUrl });
    });

    test.afterEach(() => {
      stopRecording();
    });

    test("Navigate backwards out of the Breadcrumb navigation landmark [1]", async ({
      voiceOver,
    }) => {
      await voiceOver.previous();
      await voiceOver.previous();
      await voiceOver.previous();

      assert({ voiceOver, phrase: "navigation" });
      assert({ voiceOver, phrase: "list" });
      assert({ voiceOver, phrase: "link" });
      assert({ voiceOver, phrase: "Navigate forwards from here" });
    });

    test.only("Navigate backwards out of the Breadcrumb navigation landmark [2]", async ({
      voiceOver,
    }) => {
      await voiceOver.perform(voiceOver.keyboard.commands.findPreviousLink);

      // assert({ voiceOver, phrase: "navigation" });
      // assert({ voiceOver, phrase: "list" });
      assert({ voiceOver, phrase: "link" });
      assert({ voiceOver, phrase: "Navigate forwards from here" });
    });
  });
});
