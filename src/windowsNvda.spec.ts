import { platform, release } from "os";
import { nvdaTest as test } from "./nvdaTest";
import { NVDA } from "@guidepup/guidepup";
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
import { setAllureMetadata } from "./setAllureMetadata";
import { setAllureRecording } from "./setAllureRecording";
import { Test } from "./types";

// Allow sharding across describe blocks
test.describe.configure({ mode: "parallel" });

const screenReaderName = "nvda";

type KeyCodesType = (typeof KeyCodes)[keyof typeof KeyCodes];
type ModifiersType = (typeof Modifiers)[keyof typeof Modifiers];

const setMode = async ({
  mode,
  screenReader,
}: {
  mode: Test["mode"];
  screenReader: NVDA;
}) => {
  if (mode === "interaction") {
    await screenReader.perform(screenReader.keyboardCommands.exitFocusMode);
    await screenReader.perform(
      screenReader.keyboardCommands.toggleBetweenBrowseAndFocusMode
    );
  } else {
    await screenReader.perform(screenReader.keyboardCommands.exitFocusMode);
  }
};

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
    if (typeof Modifiers[key] !== "undefined") {
      modifiers.push(Modifiers[key]);
    } else if (typeof KeyCodes[key] !== "undefined") {
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
  const osPlatform = platform();
  const osRelease = release();

  test.describe(`@windows @nvda ${references.title}`, () => {
    test.beforeEach(({ browserName, browser }) => {
      console.table({
        browserName,
        browserVersion: browser.version(),
        osPlatform,
        osRelease,
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
        let stopRecording: () => string;

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
            hasSetupScript: !!screenReaderTest.setupScript,
            moveToSystemFocusCommand: nvda.keyboardCommands.moveToFocusObject,
            mode: screenReaderTest.mode,
            page,
            screenReader: nvda,
            setMode,
            testUrl,
          });
        });

        for (const command of screenReaderCommands) {
          test(`Using command sequence '${command}'`, async ({
            browser,
            browserName,
            nvda,
          }) => {
            await setAllureMetadata({
              browserName,
              browserVersion: browser.version(),
              osPlatform,
              osRelease,
              references,
              screenReaderTest,
              testUrl,
            });
            await executeCommandSequence({ command, nvda });
            await assert({ assertions, screenReader: nvda, test });

            try {
              const recordingFilePath = stopRecording?.();

              await setAllureRecording({
                osPlatform,
                recordingFilePath,
              });
            } catch {
              annotate({ test, warning: "Screen recording failed." });
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
