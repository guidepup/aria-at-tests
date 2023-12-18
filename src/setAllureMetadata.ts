import { allure } from "allure-playwright";
import { References, Test } from "./types";

export const setAllureMetadata = async ({
  browserName,
  browserVersion,
  osPlatform,
  osRelease,
  references,
  screenReaderTest,
  testUrl,
}: {
  browserName: string;
  browserVersion: string;
  osPlatform: NodeJS.Platform;
  osRelease: string;
  references: References;
  screenReaderTest: Test;
  testUrl: string;
}) => {
  const {
    author,
    authorEmail,
    title: epic,
    designPattern,
    example,
    ...additionalReferences
  } = references;

  const { title: story, task, instructions } = screenReaderTest;

  await allure.epic(epic);
  await allure.story(story);

  await allure.parameter("browserName", browserName);
  await allure.parameter("browserVersion", browserVersion);
  await allure.parameter("osPlatform", osPlatform);
  await allure.parameter("osRelease", osRelease);

  await allure.parameter("author", author);
  await allure.parameter("authorEmail", authorEmail);
  await allure.parameter("task", task);
  await allure.parameter("instructions", instructions);

  await allure.link(testUrl, "reference");
  await allure.link(designPattern, "designPattern");
  await allure.link(example, "example");

  for (const [key, value] of Object.entries(additionalReferences)) {
    if (value.startsWith("https://")) {
      await allure.link(value, key);
    }
  }
};
