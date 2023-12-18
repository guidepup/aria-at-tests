import { Test } from "./types";

export const getScreenReaderTests = ({
  screenReaderName,
  tests,
}: {
  screenReaderName: string;
  tests: Test[];
}) =>
  tests.filter(({ appliesTo }) =>
    appliesTo.toLowerCase().split(",").includes(screenReaderName)
  );
