import { voTest as test } from "@guidepup/playwright";
import { assert, record, setup } from "./utils";

test.describe("Breadcrumb", () => {
  let stopRecording;

  test.describe("Navigate to the first breadcrumb link", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/breadcrumb/reference/2022-8-2_132648/index.setfocusbeforefirstbreadcrumblink";

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

    ["navigation", "list", "4", "link", "WAI-ARIA Authoring Practices"].forEach(
      (phrase) => {
        test(`Navigate to the first breadcrumb link | Control+Option+Right, then Control+Option+Right, then Control+Option+Right | Phrase: ${phrase}`, async ({
          voiceOver,
        }) => {
          await voiceOver.next();
          await voiceOver.next();
          await voiceOver.next();

          assert({ voiceOver, phrase });
        });

        test(`Navigate to the first breadcrumb link | Control+Option+Command+L | Phrase ${phrase}`, async ({
          voiceOver,
        }) => {
          await voiceOver.perform(voiceOver.keyboardCommands.findNextLink);

          assert({ voiceOver, phrase });
        });
      }
    );
  });

  test.describe("Navigate to the last breadcrumb link", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/breadcrumb/reference/2022-8-2_132648/index.setfocusafterlastbreadcrumblink";

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

    [
      "navigation",
      "Breadcrumb",
      "list",
      "4",
      "link",
      "Breadcrumb Example",
      "current page",
    ].forEach((phrase) => {
      test(`Navigate to the last breadcrumb link | Ctrl+Option+Left, then Ctrl+Option+Left, then Ctrl+Option+Left | Phrase: ${phrase}`, async ({
        voiceOver,
      }) => {
        await voiceOver.previous();
        await voiceOver.previous();
        await voiceOver.previous();

        assert({ voiceOver, phrase });
      });

      test(`Navigate to the last breadcrumb link | Shift+Control+Option+Command+L | Phrase: ${phrase}`, async ({
        voiceOver,
      }) => {
        await voiceOver.perform(voiceOver.keyboardCommands.findPreviousLink);

        assert({ voiceOver, phrase });
      });
    });
  });

  test.describe("Read information about a breadcrumb link", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/breadcrumb/reference/2022-8-2_132648/index.setfocusonlastbreadcrumblink";

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

    ["link", "Breadcrumb Example", "current page"].forEach((phrase) => {
      test(`Read information about a breadcrumb link | Control+Option+F3 | Phrase: ${phrase}`, async ({
        voiceOver,
      }) => {
        await voiceOver.perform(voiceOver.keyboardCommands.describeItem);

        assert({ voiceOver, phrase });
      });

      test(`Read information about a breadcrumb link | Control+Option+F4 | Phrase: ${phrase}`, async ({
        voiceOver,
      }) => {
        await voiceOver.perform(
          voiceOver.keyboardCommands.describeItemWithKeyboardFocus
        );

        assert({ voiceOver, phrase });
      });
    });
  });

  test.describe("Navigate forwards out of the Breadcrumb navigation landmark", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/breadcrumb/reference/2022-8-2_132648/index.setfocusonlastbreadcrumblink";

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

    ["navigation", "list", "link", "Navigate backwards from here"].forEach(
      (phrase) => {
        test(`Navigate forwards out of the Breadcrumb navigation landmark | Control+Option+Right, then Control+Option+Right, then Control+Option+Right | Phrase: ${phrase}`, async ({
          voiceOver,
        }) => {
          await voiceOver.next();
          await voiceOver.next();
          await voiceOver.next();

          assert({ voiceOver, phrase });
        });

        test(`Navigate forwards out of the Breadcrumb navigation landmark | Control+Option+Command+L | Phrase: ${phrase}`, async ({
          voiceOver,
        }) => {
          await voiceOver.perform(voiceOver.keyboardCommands.findNextLink);

          assert({ voiceOver, phrase });
        });
      }
    );
  });

  test.describe("Navigate backwards out of the Breadcrumb navigation landmark", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/breadcrumb/reference/2022-8-2_132648/index.setfocusonfirstbreadcrumblink";

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

    ["navigation", "list", "link", "Navigate forward from here"].forEach(
      (phrase) => {
        test(`Navigate backwards out of the Breadcrumb navigation landmark | Ctrl+Option+Left, then Ctrl+Option+Left, then Ctrl+Option+Left | Phrase: ${phrase}`, async ({
          voiceOver,
        }) => {
          await voiceOver.previous();
          await voiceOver.previous();
          await voiceOver.previous();

          assert({ voiceOver, phrase });
        });

        test(`Navigate backwards out of the Breadcrumb navigation landmark | Shift+Control+Option+Command+L | Phrase: ${phrase}`, async ({
          voiceOver,
        }) => {
          await voiceOver.perform(voiceOver.keyboardCommands.findPreviousLink);

          assert({ voiceOver, phrase });
        });
      }
    );
  });
});
