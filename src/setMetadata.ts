import { test as playwrightTest } from "@playwright/test";
import { References, Test } from "./types";

export const setMetadata = async ({
  browserName,
  browserVersion,
  osPlatform,
  osRelease,
  references,
  screenReaderTest,
  test,
  testUrl,
}: {
  browserName: string;
  browserVersion: string;
  osPlatform: NodeJS.Platform;
  osRelease: string;
  references: References;
  screenReaderTest: Test;
  test: typeof playwrightTest;
  testUrl: string;
}) => {
  const {
    title: referenceTitle,
    // Use the `testUrl` instead as more useful.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reference: _,
    ...additionalReferences
  } = references;

  const { title: testTitle, task, instructions } = screenReaderTest;

  test.info().annotations.push(
    {
      type: "referenceTitle",
      description: referenceTitle,
    },
    {
      type: "testTitle",
      description: testTitle,
    },
    {
      type: "browserName",
      description: browserName,
    },
    {
      type: "browserVersion",
      description: browserVersion,
    },
    {
      type: "osPlatform",
      description: osPlatform,
    },
    {
      type: "osRelease",
      description: osRelease,
    },
    {
      type: "task",
      description: task,
    },
    {
      type: "instructions",
      description: instructions,
    },
    {
      type: "reference",
      description: testUrl,
    }
  );

  for (const [key, value] of Object.entries(additionalReferences)) {
    test.info().annotations.push({
      type: key,
      description: value,
    });
  }
};
