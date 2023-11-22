import { Command, References, Test } from "./types";

export const getTestDetails = ({
  commands,
  name,
  references,
  screenReaderName,
  screenReaderTest,
}: {
  commands: Command[];
  name: string;
  references: References;
  screenReaderName: string;
  screenReaderTest: Test;
}) => {
  const screenReaderCommands = Object.entries(
    commands.find(
      ({ at, task, testId }) =>
        at.toLowerCase() === screenReaderName &&
        testId === screenReaderTest.testId &&
        task === screenReaderTest.task
    ) ?? {}
  )
    .filter(([key, command]) => key.startsWith("command") && !!command)
    .map<string>(([, command]) => command);

  const assertions = Object.entries(screenReaderTest)
    .filter(([key, assertion]) => key.startsWith("assertion") && !!assertion)
    .map<string>(([, assertion]) => assertion);

  const testUrl = `https://aria-at.netlify.app/tests/${name}/${references.reference.replace(
    ".html",
    `.${screenReaderTest.setupScript}`
  )}`;

  return { screenReaderCommands, assertions, testUrl };
};
