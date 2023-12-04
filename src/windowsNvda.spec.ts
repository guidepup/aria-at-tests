import { platform, release } from "os";
import { nvdaTest as test } from "./nvdaTest";
import { KeyCodes } from "@guidepup/guidepup/lib/windows/KeyCodes";
import { Modifiers } from "@guidepup/guidepup/lib/windows/Modifiers";
import { record } from "./record";
import { setup } from "./setup";
import { readTestSuitesCacheSync, TestSuite } from "./testSuites";
import { assert } from "./assert";
import { mapCommandToGuidepupKeys } from "./mapCommandToGuidepupKeys";
import { annotate } from "./annotate";
import { getTestDetails } from "./getTestDetails";
import { getScreenReaderTests } from "./getScreenReaderTests";
import { NVDA } from "@guidepup/guidepup";

const screenReaderName = "nvda";

type KeyCodesType = (typeof KeyCodes)[keyof typeof KeyCodes];
type ModifiersType = (typeof Modifiers)[keyof typeof Modifiers];

const mapCommand = (
  command: string
):
  | { error: true; mappedCommand?: undefined }
  | {
      error?: undefined;
      mappedCommand: { keyCode: KeyCodesType[]; modifiers: ModifiersType[] };
    } => {
  const keys = mapCommandToGuidepupKeys(command);

  const keyCodes: KeyCodesType[] = [];
  const modifiers: ModifiersType[] = [];

  for (const key of keys) {
    if (Modifiers[key]) {
      modifiers.push(Modifiers[key]);
    } else if (KeyCodes[key]) {
      keyCodes.push(KeyCodes[key]);
    } else {
      return { error: true };
    }
  }

  return {
    mappedCommand: {
      keyCode: keyCodes,
      modifiers,
    },
  };
};

const executeCommandSequence = async ({
  command,
  nvda,
}: {
  command: string;
  nvda: NVDA;
}) => {
  const rawCommands = command.split(",");

  for (const rawCommand of rawCommands) {
    const { mappedCommand, error } = mapCommand(rawCommand);

    console.log(`Performing command: "${rawCommand}"`);

    if (error) {
      annotate({
        test,
        warning: `Unable to parse command: "${command}"`,
      });

      return;
    }

    await nvda.perform(mappedCommand);

    const lastSpokenPhrase = await nvda.lastSpokenPhrase();

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

  test.describe(`@windows @nvda ${references.title}`, () => {
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

        test.beforeEach(async ({ page, nvda }) => {
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
            screenReader: nvda,
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
          test(`Using command sequence '${command}'`, async ({ nvda }) => {
            await executeCommandSequence({ command, nvda });

            for (const assertion of assertions) {
              await assert({ assertion, screenReader: nvda, test });
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
