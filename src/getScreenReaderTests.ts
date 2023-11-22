export const getScreenReaderTests = ({ screenReaderName, tests }) =>
  tests.filter(({ appliesTo }) =>
    appliesTo.toLowerCase().split(",").includes(screenReaderName)
  );
