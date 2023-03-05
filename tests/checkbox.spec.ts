import { MacOSKeyCodes, MacOSModifiers } from "@guidepup/guidepup";
import { voTest as test } from "@guidepup/playwright";
import { assert, record, setup } from "./utils";

test.describe("Checkbox", () => {
  let stopRecording;

  test.describe("Navigate to an unchecked checkbox", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/checkbox/reference/2020-11-23_175030/checkbox-1/checkbox-1.html";

    const expectedPhrases = ["checkbox", "Lettuce", "unticked"];

    test.beforeEach(async ({ page, voiceOver }) => {
      stopRecording = await record({ test });
      await setup({ page, testUrl });
      await voiceOver.interact();
    });

    test.afterEach(() => {
      stopRecording();
    });

    test.describe(`Navigate to an unchecked checkbox | Tab / Shift+Tab`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform({ keyCode: MacOSKeyCodes.Tab });
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate to an unchecked checkbox | Tab / Shift+Tab | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Navigate to an unchecked checkbox | Control+Option+Right / Ctrl+Option+Left`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.next();
        await voiceOver.next();
        await voiceOver.next();
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate to an unchecked checkbox | Control+Option+Right / Ctrl+Option+Left | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Navigate to an unchecked checkbox | Control+Option+Command+J / Shift+Control+Option+Command+J`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform(voiceOver.keyboardCommands.findNextControl);
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate to an unchecked checkbox | Control+Option+Command+J / Shift+Control+Option+Command+J | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });
  });

  test.describe("Navigate to a checked checkbox", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/checkbox/reference/2020-11-23_175030/checkbox-1/checkbox-1.checkfirstcheckbox";

    const expectedPhrases = ["checkbox", "Lettuce", "ticked"];

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

    test.describe(`Navigate to a checked checkbox | Tab / Shift+Tab`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform({ keyCode: MacOSKeyCodes.Tab });
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate to a checked checkbox | Tab / Shift+Tab | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Navigate to a checked checkbox | Control+Option+Right / Ctrl+Option+Left`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.next();
        await voiceOver.next();
        await voiceOver.next();
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate to a checked checkbox | Control+Option+Right / Ctrl+Option+Left | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Navigate to a checked checkbox | Control+Option+Command+J / Shift+Control+Option+Command+J`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform(voiceOver.keyboardCommands.findNextControl);
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate to a checked checkbox | Control+Option+Command+J / Shift+Control+Option+Command+J | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });
  });

  test.describe("Operate a checkbox", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/checkbox/reference/2020-11-23_175030/checkbox-1/checkbox-1.checkfirstcheckbox";

    const expectedPhrases = ["ticked", "unticked"];

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

    test.describe(`Operate a checkbox | Control+Option+Space`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform(
          voiceOver.keyboardCommands.performDefaultActionForItem
        );
        await voiceOver.perform(
          voiceOver.keyboardCommands.performDefaultActionForItem
        );
      });

      expectedPhrases.forEach((phrase) => {
        test(`Operate a checkbox | Control+Option+Space | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Operate a checkbox | Space`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform({ keyCode: MacOSKeyCodes.Space });
        await voiceOver.perform({ keyCode: MacOSKeyCodes.Space });
      });

      expectedPhrases.forEach((phrase) => {
        test(`Operate a checkbox | Space | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });
  });

  test.describe("Read an unchecked checkbox", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/checkbox/reference/2020-11-23_175030/checkbox-1/checkbox-1.movefocustofirstcheckbox";

    const expectedPhrases = ["checkbox", "Lettuce", "unticked"];

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

    test.describe(`Read an unchecked checkbox | Control+Option+F3`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform(voiceOver.keyboardCommands.describeItem);
      });

      expectedPhrases.forEach((phrase) => {
        test(`Read an unchecked checkbox | Control+Option+F3 | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Read an unchecked checkbox | Control+Option+F4`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform(
          voiceOver.keyboardCommands.describeItemWithKeyboardFocus
        );
      });

      expectedPhrases.forEach((phrase) => {
        test(`Read an unchecked checkbox | Control+Option+F4 | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });
  });

  test.describe("Read a checked checkbox", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/checkbox/reference/2020-11-23_175030/checkbox-1/checkbox-1.movefocusandcheckfirstcheckbox";

    const expectedPhrases = ["checkbox", "Lettuce", "ticked"];

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

    test.describe(`Read a checked checkbox | Control+Option+F3`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform(voiceOver.keyboardCommands.describeItem);
      });

      expectedPhrases.forEach((phrase) => {
        test(`Read a checked checkbox | Control+Option+F3 | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Read a checked checkbox | Control+Option+F4`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform(
          voiceOver.keyboardCommands.describeItemWithKeyboardFocus
        );
      });

      expectedPhrases.forEach((phrase) => {
        test(`Read a checked checkbox | Control+Option+F4 | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });
  });

  test.describe("Read grouping information of a grouped checkbox", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/checkbox/reference/2020-11-23_175030/checkbox-1/checkbox-1.html";

    const expectedPhrases = ["group", "Sandwich Condiments"];

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

    test.describe(`Read grouping information of a grouped checkbox | Control+Option+F3`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform(voiceOver.keyboardCommands.describeItem);
      });

      expectedPhrases.forEach((phrase) => {
        test(`Read grouping information of a grouped checkbox | Control+Option+F3 | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Read grouping information of a grouped checkbox | Control+Option+F4`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform(
          voiceOver.keyboardCommands.describeItemWithKeyboardFocus
        );
      });

      expectedPhrases.forEach((phrase) => {
        test(`Read grouping information of a grouped checkbox | Control+Option+F4 | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });
  });

  test.describe("Navigate sequentially through a checkbox group", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/checkbox/reference/2020-11-23_175030/checkbox-1/checkbox-1.html";

    const expectedPhrases = ["group", "Sandwich Condiments", "start", "end"];

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

    test.describe(`Navigate sequentially through a checkbox group | Control+Option+Right`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.next();
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate sequentially through a checkbox group | Control+Option+Right | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Navigate sequentially through a checkbox group | Ctrl+Option+Left`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.previous();
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate sequentially through a checkbox group | Ctrl+Option+Left | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });
  });

  test.describe("Navigate into a checkbox group", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/checkbox/reference/2020-11-23_175030/checkbox-1/checkbox-1.html";

    const expectedPhrases = ["group", "Sandwich Condiments", "start"];

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

    test.describe(`Navigate into a checkbox group | Tab`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform({ keyCode: MacOSKeyCodes.Tab });
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate into a checkbox group | Tab | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Navigate into a checkbox group | Shift+Tab`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform({ keyCode: MacOSKeyCodes.Tab, modifiers: [MacOSModifiers.Shift] });
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate into a checkbox group | Shift+Tab | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Navigate into a checkbox group | Control+Option+Right`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.next()
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate into a checkbox group | Control+Option+Right | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Navigate into a checkbox group | Control+Option+Left`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.previous()
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate into a checkbox group | Control+Option+Left | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Navigate into a checkbox group | Control+Option+Command+J`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform(voiceOver.keyboardCommands.findNextControl);
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate into a checkbox group | Control+Option+Command+J | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Navigate into a checkbox group | Shift+Control+Option+Command+J`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform(voiceOver.keyboardCommands.findPreviousControl);
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate into a checkbox group | Shift+Control+Option+Command+J | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });
  });

  test.describe("Navigate out of a checkbox group", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/checkbox/reference/2020-11-23_175030/checkbox-1/checkbox-1.html";

    const expectedPhrases = ["group", "Sandwich Condiments", "end"];

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

    test.describe(`Navigate out of a checkbox group | Tab`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform({ keyCode: MacOSKeyCodes.Tab });
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate out of a checkbox group | Tab | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Navigate out of a checkbox group | Shift+Tab`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform({ keyCode: MacOSKeyCodes.Tab, modifiers: [MacOSModifiers.Shift] });
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate out of a checkbox group | Shift+Tab | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Navigate out of a checkbox group | Control+Option+Right`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.next()
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate out of a checkbox group | Control+Option+Right | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Navigate out of a checkbox group | Control+Option+Left`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.previous()
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate out of a checkbox group | Control+Option+Left | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });
  });
});
