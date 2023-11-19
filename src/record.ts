import { macOSRecord, windowsRecord } from "@guidepup/guidepup";
import { platform, release } from "os";
import { join } from "path";

export function record({
  retry,
  screenReaderName,
  title,
}: {
  retry: number;
  screenReaderName: string;
  title: string;
}): () => void {
  const directoryPath = title
    .replaceAll(/\s+/g, "_")
    .replaceAll(/[\W_]+/g, "_")
    .toLowerCase();

  const platformName = platform();
  const fileName = `test_${platformName}_${release()}_${screenReaderName}_attempt_${retry}.mov`;
  const filePath = join("./recordings/", directoryPath, fileName);

  switch (platformName) {
    case "darwin": {
      return macOSRecord(filePath);
    }
    case "win32": {
      return windowsRecord(filePath);
    }
    default: {
      return () => {
        // Not supported
      };
    }
  }
}
