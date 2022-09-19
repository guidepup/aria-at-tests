// import { macOSRecord } from "@guidepup/guidepup";
import { platform, release } from "os";
import { join } from "path";
import { execSync, spawn } from "child_process";
import { dirname } from "path";
import { unlinkSync } from "fs";

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function record({ test }): Promise<() => void> {
  const { retry, title } = test.info();
  const directoryPath = title.replaceAll(/\s+/g, "_").toLowerCase();
  const fileName = `test_${platform()}_${release()}_${retry}.mov`;
  const filePath = join("./recordings/", directoryPath, fileName);

  // return macOSRecord(filePath);

  execSync(`mkdir -p ${dirname(filePath)}`);

  try {
    unlinkSync(filePath);
  } catch (_) {
    // file doesn't exist.
  }

  const screencapture = spawn("/usr/sbin/screencapture", [
    "-v",
    "-C",
    "-k",
    "-T0",
    "-g",
    "-m",
    `-R0,0,1440,900`,
    filePath,
  ]);

  return () => {
    screencapture.stdin.write("q");
  };
}

export async function setup({ page, testUrl, voiceOver }): Promise<void> {
  await page.goto(testUrl);
  await voiceOver.stopInteracting();
  await voiceOver.interact();

  while (!(await voiceOver.lastSpokenPhrase())?.includes("Run Test Setup")) {
    await voiceOver.next();
    await delay(50);
  }

  await voiceOver.act();
}
