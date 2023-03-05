import { MacOSKeyCodes, MacOSModifiers } from "@guidepup/guidepup";
import { voTest as test } from "@guidepup/playwright";
import { assert, record, setup } from "./utils";

test.describe("Checkbox", () => {
  let stopRecording;

  test.describe("Navigate forwards to a mixed checkbox", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/checkbox-tri-state/reference/2022-9-9_104148/checkbox-mixed.movefocusbeforefirstcheckbox";

    const expectedPhrases = [
      "group",
      "Sandwich Condiments",
      "checkbox",
      "All condiments",
      "mixed",
    ];

    test.beforeEach(async ({ page, voiceOver }) => {
      stopRecording = await record({ test });
      await setup({ page, testUrl });
      await voiceOver.interact();
    });

    test.afterEach(() => {
      stopRecording();
    });

    test.describe(`Navigate forwards to a mixed checkbox | Control+Option+Right, then Control+Option+Right, then Control+Option+Right`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.next();
        await voiceOver.next();
        await voiceOver.next();
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate forwards to a mixed checkbox | Control+Option+Right, then Control+Option+Right, then Control+Option+Right | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Navigate forwards to a mixed checkbox | Tab`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform({ keyCode: MacOSKeyCodes.Tab });
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate forwards to a mixed checkbox | Tab | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Navigate forwards to a mixed checkbox | Control+Option+Command+J, then Control+Option+Command+J`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform(voiceOver.keyboardCommands.findNextControl);
        await voiceOver.perform(voiceOver.keyboardCommands.findNextControl);
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate forwards to a mixed checkbox | Control+Option+Command+J, then Control+Option+Command+J | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });
  });

  test.describe("Navigate backwards to a mixed checkbox", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/checkbox-tri-state/reference/2022-9-9_104148/checkbox-mixed.movefocusafterfirstcheckbox";

    const expectedPhrases = [
      "group",
      "Sandwich Condiments",
      "checkbox",
      "All condiments",
      "mixed",
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

    test.describe(`Navigate backwards to a mixed checkbox | Ctrl+Option+Left, then Ctrl+Option+Left, then Ctrl+Option+Left`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.previous();
        await voiceOver.previous();
        await voiceOver.previous();
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate backwards to a mixed checkbox | Ctrl+Option+Left, then Ctrl+Option+Left, then Ctrl+Option+Left | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Navigate backwards to a mixed checkbox | Shift+Tab`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform({
          keyCode: MacOSKeyCodes.Tab,
          modifiers: [MacOSModifiers.Shift],
        });
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate backwards to a mixed checkbox | Shift+Tab | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Navigate backwards to a mixed checkbox | Shift+Control+Option+Command+J`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform(voiceOver.keyboardCommands.findPreviousControl);
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate backwards to a mixed checkbox | Shift+Control+Option+Command+J | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });
  });

  test.describe("Read information about a mixed checkbox", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/checkbox-tri-state/reference/2022-9-9_104148/checkbox-mixed.movefocustofirstcheckbox";

    const expectedPhrases = [
      "group",
      "Sandwich Condiments",
      "checkbox",
      "All condiments",
      "mixed",
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

    test.describe(`Read information about a mixed checkbox | Control+Option+F3`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform(voiceOver.keyboardCommands.describeItem);
      });

      expectedPhrases.forEach((phrase) => {
        test(`Read information about a mixed checkbox | Control+Option+F3 | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Read information about a mixed checkbox | Control+Option+F4`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform(
          voiceOver.keyboardCommands.describeItemWithKeyboardFocus
        );
      });

      expectedPhrases.forEach((phrase) => {
        test(`Read information about a mixed checkbox | Control+Option+F4 | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });
  });

  test.describe("Operate a mixed checkbox", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/checkbox-tri-state/reference/2022-9-9_104148/checkbox-mixed.movefocustofirstcheckbox";

    const expectedPhrases = ["checked"];

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

    test.describe(`Operate a mixed checkbox | Control+Option+Space`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform(
          voiceOver.keyboardCommands.performDefaultActionForItem
        );
      });

      expectedPhrases.forEach((phrase) => {
        test(`Operate a mixed checkbox | Control+Option+Space | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Operate a mixed checkbox | Space`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform({ keyCode: MacOSKeyCodes.Space });
      });

      expectedPhrases.forEach((phrase) => {
        test(`Operate a mixed checkbox | Space | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });
  });

  test.describe("Operate an unchecked checkbox", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/checkbox-tri-state/reference/2022-9-9_104148/checkbox-mixed.movefocustoanduncheckfirstcheckbox";

    const expectedPhrases = ["mixed"];

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

    test.describe(`Operate an unchecked checkbox | Control+Option+Space`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform(
          voiceOver.keyboardCommands.performDefaultActionForItem
        );
      });

      expectedPhrases.forEach((phrase) => {
        test(`Operate an unchecked checkbox | Control+Option+Space | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Operate an unchecked checkbox | Space`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform({ keyCode: MacOSKeyCodes.Space });
      });

      expectedPhrases.forEach((phrase) => {
        test(`Operate an unchecked checkbox | Space | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });
  });

  test.describe("Navigate forwards out of a checkbox group", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/checkbox-tri-state/reference/2022-9-9_104148/checkbox-mixed.movefocustofirstcheckbox";

    const expectedPhrases = ["group", "link", "Navigate backwards from here"];

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

    test.describe(`Navigate forwards out of a checkbox group | Control+Option+Right, then Control+Option+Right`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.next();
        await voiceOver.next();
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate forwards out of a checkbox group | Control+Option+Right, then Control+Option+Right | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Navigate forwards out of a checkbox group | Control+Option+Command+L`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform(voiceOver.keyboardCommands.findNextLink);
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate forwards out of a checkbox group | Control+Option+Command+L | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });
  });

  test.describe("Navigate forwards out of a checkbox group", () => {
    const testUrl =
      "https://aria-at.netlify.app/tests/checkbox-tri-state/reference/2022-9-9_104148/checkbox-mixed.movefocustofirstcheckbox";

    const expectedPhrases = ["group", "link", "Navigate backwards from here"];

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

    test.describe(`Navigate forwards out of a checkbox group | Ctrl+Option+Left, then Ctrl+Option+Left, then Ctrl+Option+Left`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.previous();
        await voiceOver.previous();
        await voiceOver.previous();
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate forwards out of a checkbox group | Ctrl+Option+Left, then Ctrl+Option+Left, then Ctrl+Option+Left | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });

    test.describe(`Navigate forwards out of a checkbox group | Shift+Control+Option+Command+L`, () => {
      test.beforeEach(async ({ voiceOver }) => {
        await voiceOver.perform(voiceOver.keyboardCommands.findPreviousLink);
      });

      expectedPhrases.forEach((phrase) => {
        test(`Navigate forwards out of a checkbox group | Shift+Control+Option+Command+L | Phrase: ${phrase}`, ({
          voiceOver,
        }) => {
          assert({ voiceOver, phrase });
        });
      });
    });
  });
});
