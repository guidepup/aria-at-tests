import { platform, release } from "os";
import { voTest as test } from "@guidepup/playwright";
import { KeyCodes } from "@guidepup/guidepup/lib/macOS/KeyCodes";
import { Modifiers } from "@guidepup/guidepup/lib/macOS/Modifiers";
import { record } from "./record";
import { setup } from "./setup";
import { readTestSuitesCacheSync, TestSuite } from "./testSuites";
import { assert } from "./assert";
import { mapCommandToGuidepupKeys } from "./mapCommandToGuidepupKeys";
import { annotate } from "./annotate";
import { getTestDetails } from "./getTestDetails";
import { getScreenReaderTests } from "./getScreenReaderTests";

const screenReaderName = "voiceover_macos";

const mapCommand = (
  command
):
  | { error: true; voiceOverCommand?: undefined; mappedCommand?: undefined }
  | {
      error?: undefined;
      voiceOverCommand: true;
      mappedCommand: { keyCode: KeyCodes[]; modifiers: Modifiers[] };
    }
  | {
      error?: undefined;
      voiceOverCommand: false;
      mappedCommand: { keyCode: string[]; modifiers: string[] };
    } => {
  const keys = mapCommandToGuidepupKeys(command);

  const isVoiceOverCommand =
    keys.includes("Control") && keys.includes("Options");

  if (isVoiceOverCommand) {
    const keyCodes: KeyCodes[] = [];
    const modifiers: Modifiers[] = [];

    for (const key of keys) {
      if (Modifiers[key]) {
        modifiers.push(Modifiers[key]);
      } else if (KeyCodes[key]) {
        keyCodes.push(KeyCodes[key as keyof KeyCodes]);
      } else {
        return { error: true };
      }
    }

    return {
      voiceOverCommand: true,
      mappedCommand: {
        keyCode: keyCodes,
        modifiers,
      },
    };
  }

  const keyCodes: string[] = [];
  const modifiers: string[] = [];

  for (const key of keys) {
    if (Modifiers[key]) {
      modifiers.push(key);
    } else if (KeyCodes[key]) {
      keyCodes.push(key);
    } else {
      return { error: true };
    }
  }

  return {
    voiceOverCommand: false,
    mappedCommand: {
      keyCode: keyCodes,
      modifiers,
    },
  };
};

const executeCommandSequence = async ({ command, voiceOver }) => {
  const rawCommands = command.split(",");

  for (const rawCommand of rawCommands) {
    console.log(`Performing command: "${rawCommand}".`);

    const { voiceOverCommand, mappedCommand, error } = mapCommand(rawCommand);

    if (error) {
      annotate({
        test,
        warning: `Unable to parse command: "${command}"`,
      });

      return;
    }

    // E.g. Sending "Tab" to VO isn't recognised. It is a keypress
    // that is recognised by the browser and prompts VO to act.
    if (voiceOverCommand) {
      await voiceOver.perform(mappedCommand);
    } else {
      const keyboardString = [
        ...mappedCommand.modifiers,
        ...mappedCommand.keyCode,
      ].join("+");

      await voiceOver.press(keyboardString);
    }

    const lastSpokenPhrase = await voiceOver.lastSpokenPhrase();

    console.log(`Screen reader output: "${lastSpokenPhrase}".`);
  }
};

const generateTestSuite = ({
  commands,
  name,
  references,
  tests,
}: TestSuite) => {
  const screenReaderTests = getScreenReaderTests({ screenReaderName, tests });

  test.describe(`@macos @voiceOver ${references.title}`, () => {
    test.beforeEach(({ browserName, browser }) => {
      console.table({
        osPlatform: platform(),
        osRelease: release(),
        browserName,
        browserVersion: browser.version(),
      });

      console.table(references);
    });

    for (const screenReaderTest of screenReaderTests) {
      const { screenReaderCommands, assertions, testUrl } = getTestDetails({
        commands,
        name,
        references,
        screenReaderName,
        screenReaderTest,
      });

      test.describe(screenReaderTest.title, () => {
        let stopRecording: () => void;

        test.beforeEach(async ({ page, voiceOver }) => {
          console.table(screenReaderTest);

          try {
            stopRecording = record({
              test,
              screenReaderName,
            });
          } catch {
            annotate({ test, warning: "Screen recording failed." });
          }

          await setup({
            page,
            testUrl,
            screenReader: voiceOver,
          });
        });

        test.afterEach(() => {
          try {
            stopRecording?.();
          } catch {
            annotate({ test, warning: "Screen recording failed." });
          }
        });

        for (const command of screenReaderCommands) {
          test(`Using command sequence '${command}'`, async ({ voiceOver }) => {
            await executeCommandSequence({ command, voiceOver });

            for (const assertion of assertions) {
              await assert({ assertion, screenReader: voiceOver, test });
            }
          });
        }
      });
    }
  });
};

const generateTestSuites = () => {
  const testSuites = readTestSuitesCacheSync();

  for (const testSuite of testSuites) {
    generateTestSuite(testSuite);
  }
};

generateTestSuites();
