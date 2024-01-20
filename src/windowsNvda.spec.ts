import { platform, release } from "os";
import { NVDAPlaywright, nvdaTest as test } from "@guidepup/playwright";
import { NVDA, WindowsKeyCodes, WindowsModifiers } from "@guidepup/guidepup";
import { record } from "./record";
import { setup } from "./setup";
import { readTestSuitesCacheSync, TestSuite } from "./testSuites";
import { assert } from "./assert";
import { mapCommandToGuidepupKeys } from "./mapCommandToGuidepupKeys";
import { annotateIssue } from "./annotateIssue";
import { getTestDetails } from "./getTestDetails";
import { getScreenReaderTests } from "./getScreenReaderTests";
import { setMetadata } from "./setMetadata";
import { attachRecording } from "./attachRecording";
import { Test } from "./types";
import { log, table } from "./log";

// Allow sharding across describe blocks
test.describe.configure({ mode: "parallel" });

const screenReaderName = "nvda";

type KeyCodesType = (typeof WindowsKeyCodes)[keyof typeof WindowsKeyCodes];
type ModifiersType = (typeof WindowsModifiers)[keyof typeof WindowsModifiers];

const setMode = async ({
  mode,
  screenReader,
}: {
  mode: Test["mode"];
  screenReader: NVDAPlaywright;
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
    if (typeof WindowsModifiers[key] !== "undefined") {
      modifiers.push(WindowsModifiers[key]);
    } else if (typeof WindowsKeyCodes[key] !== "undefined") {
      keyCodes.push(WindowsKeyCodes[key]);
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

    log(`Performing command: "${rawCommand}"`);

    if (error) {
      const issue = `Unable to parse command: "${command}"`;

      annotateIssue({
        test,
        issue,
      });

      test.info().fixme(true, issue);

      return;
    }

    await nvda.perform(mappedCommand);

    const lastSpokenPhrase = await nvda.lastSpokenPhrase();

    log(`Screen reader output: "${lastSpokenPhrase}".`);
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
      table({
        browserName,
        browserVersion: browser.version(),
        osPlatform,
        osRelease,
      });

      table(references);
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

        test.beforeEach(async ({ browser, browserName, page, nvda }) => {
          table(screenReaderTest);

          try {
            stopRecording = record({
              browserName,
              browserVersion: browser.version(),
              test,
              screenReaderName,
            });
          } catch {
            annotateIssue({ test, issue: "Screen recording failed." });
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
            await setMetadata({
              browserName,
              browserVersion: browser.version(),
              osPlatform,
              osRelease,
              references,
              screenReaderTest,
              test,
              testUrl,
            });
            await executeCommandSequence({ command, nvda });
            await assert({ assertions, screenReader: nvda, test });

            try {
              await attachRecording({
                path: stopRecording?.(),
                test,
              });
            } catch {
              annotateIssue({ test, issue: "Screen recording failed." });
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
