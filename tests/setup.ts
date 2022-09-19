import { macOSRecord } from "@guidepup/guidepup";
import { platform, release } from "os";
import { join } from "path";

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function record({ test }): Promise<() => void> {
  const { retry, title } = test.info();
  const directoryPath = title.replaceAll(/\s+/g, "_").toLowerCase();
  const fileName = `test_${platform()}_${release()}_${retry}.mov`;
  const filePath = join("./recordings/", directoryPath, fileName);

  return macOSRecord(filePath);
}

export async function setup({ page, testUrl, voiceOver }): Promise<void> {
  await page.goto(testUrl);
  await delay(50);

  await voiceOver.stopInteracting();
  await voiceOver.stopInteracting();
  await voiceOver.stopInteracting();
  await voiceOver.interact();

  while (!(await voiceOver.lastSpokenPhrase())?.includes("Run Test Setup")) {
    await voiceOver.next();
    await delay(50);
  }

  await voiceOver.act();
}
