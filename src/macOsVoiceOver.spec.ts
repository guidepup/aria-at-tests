import { platform, release } from "os";
import { voTest as test } from "@guidepup/playwright";
import { VoiceOver } from "@guidepup/guidepup";
import { KeyCodes } from "@guidepup/guidepup/lib/macOS/KeyCodes";
import { Modifiers } from "@guidepup/guidepup/lib/macOS/Modifiers";
import { record } from "./record";
import { setup } from "./setup";
import { readTestSuitesCacheSync, TestSuite } from "./testSuites";
import { assert } from "./assert";
import { mapCommandToGuidepupKeys } from "./mapCommandToGuidepupKeys";
import { annotateIssue } from "./annotateIssue";
import { getTestDetails } from "./getTestDetails";
import { getScreenReaderTests } from "./getScreenReaderTests";
import { applicationNameMap } from "./applicationNameMap";
import { setMetadata } from "./setMetadata";
import { attachRecording } from "./attachRecording";
import { log } from "./log";

// Allow sharding across describe blocks
test.describe.configure({ mode: "parallel" });

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
      if (typeof Modifiers[key] !== "undefined") {
        modifiers.push(Modifiers[key]);
      } else if (typeof KeyCodes[key] !== "undefined") {
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
    if (typeof Modifiers[key] !== "undefined") {
      modifiers.push(key);
    } else if (typeof KeyCodes[key] !== "undefined") {
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

const executeCommandSequence = async ({
  browserName,
  command,
  voiceOver,
}: {
  browserName: string;
  command: string;
  voiceOver: VoiceOver;
}) => {
  const rawCommands = command.split(",");

  for (const rawCommand of rawCommands) {
    log(`Performing command: "${rawCommand}".`);

    const { voiceOverCommand, mappedCommand, error } = mapCommand(rawCommand);

    if (error) {
      const issue = `Unable to parse command: "${command}"`;

      annotateIssue({
        test,
        issue,
      });

      test.info().fixme(true, issue);

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

      await voiceOver.press(keyboardString, {
        application: applicationNameMap[browserName],
      });
    }

    const lastSpokenPhrase = await voiceOver.lastSpokenPhrase();

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

  test.describe(`@macos @voiceOver ${references.title}`, () => {
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

        test.beforeEach(async ({ page, voiceOver }) => {
          console.table(screenReaderTest);

          try {
            stopRecording = record({
              test,
              screenReaderName,
            });
          } catch {
            annotateIssue({ test, issue: "Screen recording failed." });
          }

          await setup({
            hasSetupScript: !!screenReaderTest.setupScript,
            mode: screenReaderTest.mode,
            moveToSystemFocusCommand:
              voiceOver.keyboardCommands.moveCursorToKeyboardFocus,
            page,
            screenReader: voiceOver,
            setMode: () => {},
            testUrl,
          });
        });

        for (const command of screenReaderCommands) {
          test(`Using command sequence '${command}'`, async ({
            browser,
            browserName,
            voiceOver,
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
            await executeCommandSequence({ browserName, command, voiceOver });
            await assert({ assertions, screenReader: voiceOver, test });

            try {
              await attachRecording({
                osPlatform,
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
