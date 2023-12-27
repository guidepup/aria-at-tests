export const annotateIssue = ({ test, issue }) => {
  console.warn(issue);

  test.info().annotations.push({
    type: "issue",
    description: issue,
  });
};
