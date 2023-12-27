import { warn } from "./log";

export const annotateIssue = ({ test, issue }) => {
  warn(issue);

  test.info().annotations.push({
    type: "⚠️ issue",
    description: issue,
  });
};
