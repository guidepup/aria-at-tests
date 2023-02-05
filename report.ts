import { readdirSync } from "fs";
import { join } from "path";
import { mergeHTMLReports } from "playwright-merge-html-reports";

const reportPathsToMerge = readdirSync(
  join(process.cwd(), "playwright-report"),
  {
    withFileTypes: true,
  }
)
  .filter((item) => item.isDirectory())
  .map(({ name }) => join(process.cwd(), "playwright-report", name));

mergeHTMLReports(reportPathsToMerge, {
  outputFolderName: "html-report",
});
