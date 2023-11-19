import { promises, readFileSync } from "fs";
import { resolve } from "path";
import csv from "csvtojson";
import { Command, RawReference, References, Test } from "./types";

export interface TestSuite {
  commands: Command[];
  directory: string;
  name: string;
  references: References;
  tests: Test[];
}

const nonTestDirectories: string[] = [
  "resources",
  "commands.json",
  "support.json",
];

const ariaAtTestsPath = resolve(__dirname, "../aria-at/tests");
const testSuitesCachePath = resolve(__dirname, "../testSuites.json");

export const getTestSuites = async ({
  ignoredTests = [],
}: { ignoredTests?: string[] } = {}): Promise<TestSuite[]> => {
  const tests: TestSuite[] = [];
  const ariaAtTestsDirectory = await promises.opendir(ariaAtTestsPath);

  for await (const { name } of ariaAtTestsDirectory) {
    if (nonTestDirectories.includes(name)) {
      continue;
    }

    if (ignoredTests.includes(name)) {
      continue;
    }

    const directory = resolve(ariaAtTestsPath, name);
    const commandsPath = resolve(directory, "data/commands.csv");
    const referencesPath = resolve(directory, "data/references.csv");
    const testsPath = resolve(directory, "data/tests.csv");

    const rawReferences: RawReference[] = await csv().fromFile(referencesPath);
    const references = rawReferences.reduce<References>(
      (referenceAggregator, { refId, value }) => {
        referenceAggregator[refId] = value;

        return referenceAggregator;
      },
      {} as References
    );

    tests.push({
      commands: await csv().fromFile(commandsPath),
      directory,
      name,
      references,
      tests: await csv().fromFile(testsPath),
    });
  }

  return tests;
};

export const writeTestSuitesCache = async ({
  ignoredTests = [],
}: { ignoredTests?: string[] } = {}): Promise<void> => {
  const testSuites = await getTestSuites({ ignoredTests });

  await promises.writeFile(testSuitesCachePath, JSON.stringify(testSuites));
};

export const readTestSuitesCacheSync = () => {
  const testSuitesCache = readFileSync(testSuitesCachePath, {
    encoding: "utf8",
  });
  const testSuites = JSON.parse(testSuitesCache);

  return testSuites;
};
