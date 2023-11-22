import { macOSRecord, windowsRecord } from "@guidepup/guidepup";
import { voTest } from "@guidepup/playwright";
import { platform, release } from "os";
import { join } from "path";

export function record({
  screenReaderName,
  test,
}: {
  screenReaderName: string;
  test: typeof voTest;
}): () => void {
  const { title, retry } = test.info();

  const directoryPath = title
    .replaceAll(/\s+/g, "_")
    .replaceAll(/[\W_]+/g, "_")
    .toLowerCase();

  const platformName = platform();
  const fileName = `test_${platformName}_${release()}_${screenReaderName}_attempt_${retry}.mov`;
  const filePath = join("./recordings/", directoryPath, fileName);

  console.table({ directoryPath, fileName });

  switch (platformName) {
    case "darwin": {
      return macOSRecord(filePath);
    }
    case "win32": {
      return windowsRecord(filePath);
    }
    default: {
      return () => {
        // Not Supported
      };
    }
  }
}
