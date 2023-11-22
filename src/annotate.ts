export const annotate = ({ test, warning }) => {
  console.log(warning);

  test.info().annotations.push({
    type: "issue",
    description: warning,
  });
};
