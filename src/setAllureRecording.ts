import { accessSync, constants, readFileSync } from "fs";
import { basename } from "path";
import { allure } from "allure-playwright";
import { delay } from "./delay";

const MP4 = "video/mp4";
const MOV = "video/quicktime";

const EXISTS_RETRIES = 20;
const EXISTS_WAIT = 100;

export const setAllureRecording = async ({
  osPlatform,
  recordingFilePath,
}: {
  osPlatform: NodeJS.Platform;
  recordingFilePath: string;
}) => {
  if (!recordingFilePath) {
    return;
  }

  for (let i = 0; i < EXISTS_RETRIES; i++) {
    try {
      accessSync(recordingFilePath, constants.F_OK);

      break;
    } catch (e) {
      if (i === EXISTS_RETRIES - 1) {
        throw e;
      }
    }

    await delay(EXISTS_WAIT);
  }

  const buffer = readFileSync(recordingFilePath);
  const name = basename(recordingFilePath);
  const contentType = osPlatform === "darwin" ? MOV : MP4;

  await allure.attachment(name, buffer, contentType);
};
