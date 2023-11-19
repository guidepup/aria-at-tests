import { voTest as test } from "@guidepup/playwright";
import { KeyCodes } from "@guidepup/guidepup/lib/macOS/KeyCodes";
import { Modifiers } from "@guidepup/guidepup/lib/macOS/Modifiers";
import { record } from "./record";
import { setup } from "./setup";
import { readTestSuitesCacheSync, TestSuite } from "./testSuites";
import { assert } from "./assert";

const toTitleCase = (key: string) =>
  key.charAt(0).toUpperCase() + key.substring(1).toLowerCase();

const mapCommand = (command) => {
  if (/\//.test(command)) {
    return { error: true };
  }

  if (/[()]/.test(command)) {
    return { error: true };
  }

  if (/\bor\b/.test(command)) {
    return { error: true };
  }

  if (/\bfollowed\b/.test(command)) {
    return { error: true };
  }

  const keys = command
    // PAGE_DOWN and PAGE_UP are the only commands that have the extra _ inside a key
    .replaceAll("PAGE_DOWN", "PageDown")
    .replaceAll("PAGE_UP", "PageUp")
    .replace("CTRL", "Control")
    .replace("OPT", "Option")
    .replace("CMD", "Command")
    .split("_")
    .map((key) => toTitleCase(key.trim()));

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
    mappedCommand: {
      keyCode: keyCodes,
      modifiers,
    },
  };
};

const applicationNameMap = {
  chromium: "Chromium",
  chrome: "Google Chrome",
  "chrome-beta": "Google Chrome Beta",
  msedge: "Microsoft Edge",
  "msedge-beta": "Microsoft Edge Beta",
  "msedge-dev": "Microsoft Edge Dev",
  firefox: "Nightly",
  webkit: "Playwright",
};

const voiceOverMacOs = "voiceover_macos";

const generateTestSuite = ({
  commands,
  name,
  references,
  tests,
}: TestSuite) => {
  const screenReaderTests = tests.filter(({ appliesTo }) =>
    appliesTo.toLowerCase().split(",").includes(voiceOverMacOs)
  );

  test.describe(references.title, () => {
    test.beforeAll(() => {
      console.table(references);
    });

    screenReaderTests.forEach((screenReaderTest) => {
      const screenReaderCommands = Object.entries(
        commands.find(
          ({ at, task, testId }) =>
            at.toLowerCase() === voiceOverMacOs &&
            testId === screenReaderTest.testId &&
            task === screenReaderTest.task
        ) ?? {}
      )
        .filter(([key, command]) => key.startsWith("command") && !!command)
        .map(([, command]) => command);

      const assertions = Object.entries(screenReaderTest)
        .filter(
          ([key, assertion]) => key.startsWith("assertion") && !!assertion
        )
        .map(([, assertion]) => assertion);

      const testUrl = `https://aria-at.netlify.app/tests/${name}/${references.reference.replace(
        ".html",
        `.${screenReaderTest.setupScript}`
      )}`;

      test.describe(screenReaderTest.title, () => {
        let stopRecording: () => void;

        test.beforeAll(() => {
          console.table(screenReaderTest);
        });

        test.beforeEach(async ({ browserName, page, voiceOver }) => {
          const { title, retry } = test.info();

          try {
            stopRecording = record({
              title,
              retry,
              screenReaderName: "voiceOver",
            });
          } catch {
            const warning = `Screen recording failed.`;

            console.warn(warning);

            test.info().annotations.push({
              type: "issue",
              description: warning,
            });
          }

          await setup({
            applicationName: applicationNameMap[browserName],
            page,
            testUrl,
            screenReader: voiceOver,
          });
        });

        test.afterEach(() => {
          try {
            stopRecording?.();
          } catch {
            const warning = `Screen recording failed.`;

            console.warn(warning);

            test.info().annotations.push({
              type: "issue",
              description: warning,
            });
          }
        });

        screenReaderCommands.forEach((command) => {
          assertions.forEach((assertion) => {
            test(`using command '${command}': ${assertion}`, async ({
              voiceOver,
            }) => {
              const rawCommands = command.split(",");

              for (const rawCommand of rawCommands) {
                console.log(`Performing command: "${rawCommand}".`);

                const { mappedCommand, error } = mapCommand(rawCommand);

                if (error) {
                  const warning = `Unable to parse command: "${command}"`;

                  console.warn(warning);

                  test.info().annotations.push({
                    type: "issue",
                    description: warning,
                  });

                  return;
                }

                await voiceOver.perform(mappedCommand);

                const lastSpokenPhrase = await voiceOver.lastSpokenPhrase();

                console.log(`Screen reader output: "${lastSpokenPhrase}".`);
              }

              assert({ assertion, screenReader: voiceOver, test });
            });
          });
        });
      });
    });
  });
};

const generateTestSuites = () => {
  const testSuites = readTestSuitesCacheSync();

  testSuites.forEach((testSuite) => generateTestSuite(testSuite));
};

generateTestSuites();
