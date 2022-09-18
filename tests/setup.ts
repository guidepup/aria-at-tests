import { macOSRecord } from "@guidepup/guidepup";
import { join } from "path";
import { delay } from "./delay";

export async function setup({
  page,
  test,
  testUrl,
  voiceOver,
}): Promise<() => void> {
  const stopRecording = macOSRecord(
    join(
      "./recordings/",
      test.info().title.replaceAll(/\s+/g, "_").toLowerCase(),
      "test.mov"
    )
  );

  await page.goto(testUrl);

  await voiceOver.stopInteracting();
  await voiceOver.interact();

  while (!(await voiceOver.lastSpokenPhrase())?.includes("Run Test Setup")) {
    await voiceOver.next();
    await delay(50);
  }

  await voiceOver.act();

  return stopRecording;
}
