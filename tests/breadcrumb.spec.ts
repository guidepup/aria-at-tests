import { voTest as test } from "@guidepup/playwright";
import { assert, record, setup } from "./utils";

test.describe("Breadcrumb", () => {
  let stopRecording;

  test.describe("Navigate to the first breadcrumb link", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/breadcrumb/reference/2022-8-2_132648/index.setfocusbeforefirstbreadcrumblink";

    const expectedPhrases = [
      "navigation",
      "list",
      "4",
      "link",
      "WAI-ARIA Authoring Practices",
    ];

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

    test.describe("Navigate to the first breadcrumb link | Control+Option+Right, then Control+Option+Right", () => {
      test.beforeAll(async ({ voiceOver }) => {
        await voiceOver.next();
        await voiceOver.next();
        await voiceOver.next();
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate to the first breadcrumb link | Control+Option+Right, then Control+Option+Right, then Control+Option+Right | Phrase: ${phrase}`, async ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe("Navigate to the first breadcrumb link | Control+Option+Command+L", () => {
      test.beforeAll(async ({ voiceOver }) => {
        await voiceOver.perform(voiceOver.keyboardCommands.findNextLink);
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate to the first breadcrumb link | Control+Option+Command+L, then Control+Option+Right | Phrase: ${phrase}`, async ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });
  });

  test.describe("Navigate to the last breadcrumb link", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/breadcrumb/reference/2022-8-2_132648/index.setfocusafterlastbreadcrumblink";

    const expectedPhrases = [
      "navigation",
      "Breadcrumb",
      "list",
      "4",
      "link",
      "Breadcrumb Example",
      "current page",
    ];

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

    test.describe("Navigate to the last breadcrumb link | Ctrl+Option+Left, then Ctrl+Option+Left, then Ctrl+Option+Left", () => {
      test.beforeAll(async ({ voiceOver }) => {
        await voiceOver.previous();
        await voiceOver.previous();
        await voiceOver.previous();
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate to the last breadcrumb link | Ctrl+Option+Left, then Ctrl+Option+Left, then Ctrl+Option+Left | Phrase: ${phrase}`, async ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe("Navigate to the last breadcrumb link | Shift+Control+Option+Command+L", () => {
      test.beforeAll(async ({ voiceOver }) => {
        await voiceOver.perform(voiceOver.keyboardCommands.findPreviousLink);
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate to the last breadcrumb link | Shift+Control+Option+Command+L | Phrase: ${phrase}`, async ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });
  });

  test.describe("Read information about a breadcrumb link", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/breadcrumb/reference/2022-8-2_132648/index.setfocusonlastbreadcrumblink";

    const expectedPhrases = ["link", "Breadcrumb Example", "current page"];

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

    test.describe("Read information about a breadcrumb link | Control+Option+F3", () => {
      test.beforeAll(async ({ voiceOver }) => {
        await voiceOver.perform(voiceOver.keyboardCommands.describeItem);
      });

      expectedPhrases.forEach((phrase) => {
        test(`Read information about a breadcrumb link | Control+Option+F3 | Phrase: ${phrase}`, async ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe("Read information about a breadcrumb link | Control+Option+F4", () => {
      test.beforeAll(async ({ voiceOver }) => {
        await voiceOver.perform(
          voiceOver.keyboardCommands.describeItemWithKeyboardFocus
        );
      });

      expectedPhrases.forEach((phrase) => {
        test(`Read information about a breadcrumb link | Control+Option+F4 | Phrase: ${phrase}`, async ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });
  });

  test.describe("Navigate forwards out of the Breadcrumb navigation landmark", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/breadcrumb/reference/2022-8-2_132648/index.setfocusonlastbreadcrumblink";

    const expectedPhrases = [
      "navigation",
      "list",
      "link",
      "Navigate backwards from here",
    ];

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

    test.describe("Navigate forwards out of the Breadcrumb navigation landmark | Control+Option+Right, then Control+Option+Right, then Control+Option+Right", () => {
      test.beforeAll(async ({ voiceOver }) => {
        await voiceOver.next();
        await voiceOver.next();
        await voiceOver.next();
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate forwards out of the Breadcrumb navigation landmark | Control+Option+Right, then Control+Option+Right, then Control+Option+Right | Phrase: ${phrase}`, async ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe("Navigate forwards out of the Breadcrumb navigation landmark | Control+Option+Command+L", () => {
      test.beforeAll(async ({ voiceOver }) => {
        await voiceOver.perform(voiceOver.keyboardCommands.findNextLink);
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate forwards out of the Breadcrumb navigation landmark | Control+Option+Command+L | Phrase: ${phrase}`, async ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });
  });

  test.describe("Navigate backwards out of the Breadcrumb navigation landmark", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/breadcrumb/reference/2022-8-2_132648/index.setfocusonfirstbreadcrumblink";

    const expectedPhrases = [
      "navigation",
      "list",
      "link",
      "Navigate forwards from here",
    ];

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

    test.describe("Navigate backwards out of the Breadcrumb navigation landmark | Ctrl+Option+Left, then Ctrl+Option+Left, then Ctrl+Option+Left", () => {
      test.beforeAll(async ({ voiceOver }) => {
        await voiceOver.previous();
        await voiceOver.previous();
        await voiceOver.previous();
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate backwards out of the Breadcrumb navigation landmark | Ctrl+Option+Left, then Ctrl+Option+Left, then Ctrl+Option+Left | Phrase: ${phrase}`, async ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe("Navigate backwards out of the Breadcrumb navigation landmark | Shift+Control+Option+Command+L", () => {
      test.beforeAll(async ({ voiceOver }) => {
        await voiceOver.perform(voiceOver.keyboardCommands.findPreviousLink);
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate backwards out of the Breadcrumb navigation landmark | Shift+Control+Option+Command+L | Phrase: ${phrase}`, async ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });
  });
});
