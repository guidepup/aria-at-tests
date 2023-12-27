import { accessSync, constants } from "fs";
import { basename } from "path";
import { test as playwrightTest } from "@playwright/test";
import { delay } from "./delay";

const MP4 = "video/mp4";
const MOV = "video/quicktime";

const EXISTS_RETRIES = 20;
const EXISTS_WAIT = 100;

export const attachRecording = async ({
  osPlatform,
  path,
  test,
}: {
  osPlatform: NodeJS.Platform;
  path: string;
  test: typeof playwrightTest;
}) => {
  if (!path) {
    return;
  }

  // Only attach failed test recordings
  if (!test.info().errors?.length) {
    return;
  }

  for (let i = 0; i < EXISTS_RETRIES; i++) {
    try {
      accessSync(path, constants.F_OK);

      break;
    } catch (e) {
      if (i === EXISTS_RETRIES - 1) {
        throw e;
      }
    }

    await delay(EXISTS_WAIT);
  }

  const name = basename(path);
  const contentType = osPlatform === "darwin" ? MOV : MP4;

  await test.info().attach(name, { contentType, path });
};
