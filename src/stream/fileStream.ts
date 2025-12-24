import { createReadStream } from "fs";
import { createInterface } from "readline";

/**
 * Stream-based file reader for memory efficiency
 *
 * @param filePath - Path to the log file
 * @param onLine - Callback invoked for each line
 * @returns Promise that resolves when streaming is complete
 */
export async function streamLines(
  filePath: string,
  onLine: (line: string) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const fileStream = createReadStream(filePath, {
      encoding: "utf-8",
      highWaterMark: 64 * 1024, // 64KB buffer
    });

    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    rl.on("line", onLine);

    rl.on("close", () => {
      resolve();
    });

    fileStream.on("error", (error) => {
      reject(new Error(`Failed to read file: ${error.message}`));
    });

    rl.on("error", (error) => {
      reject(new Error(`Failed to process file: ${error.message}`));
    });
  });
}
