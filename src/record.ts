import { macOSRecord, windowsRecord } from "@guidepup/guidepup";
import { test as playwrightTest } from "@playwright/test";
import { platform, release } from "os";
import { join } from "path";
import { table } from "./log";

export function record({
  screenReaderName,
  test,
}: {
  screenReaderName: string;
  test: typeof playwrightTest;
}): () => string {
  const { title, retry } = test.info();

  const sanitizedTitle = title
    .replaceAll(/\s+/g, "_")
    .replaceAll(/[\W_]+/g, "_")
    .toLowerCase();

  const platformName = platform();

  switch (platformName) {
    case "darwin": {
      const recordingFileName = `test_${platformName}_${release()}_${screenReaderName}_${sanitizedTitle}_attempt_${retry}.mov`;
      const recordingFilePath = join("./recordings/", recordingFileName);

      table({ recordingFileName });

      const stopRecording = macOSRecord(recordingFilePath);

      return () => {
        stopRecording();

        return recordingFilePath;
      };
    }
    case "win32": {
      const recordingFileName = `test_${platformName}_${release()}_${screenReaderName}_${sanitizedTitle}_attempt_${retry}.mp4`;
      const recordingFilePath = join("./recordings/", recordingFileName);

      table({ recordingFileName });

      const stopRecording = windowsRecord(recordingFilePath);

      return () => {
        stopRecording();

        return recordingFilePath;
      };
    }
    default: {
      return () => {
        // Not Supported

        return "";
      };
    }
  }
}
