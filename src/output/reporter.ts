import { writeFile } from "fs/promises";
import { AnalysisSummary } from "../types/index.js";

/**
 * Write analysis summary to a JSON file
 *
 * @param summary - The analysis summary to write
 * @param outputPath - Path to the output JSON file
 */
export async function writeReport(
  summary: AnalysisSummary,
  outputPath: string,
): Promise<void> {
  try {
    const json = JSON.stringify(summary, null, 2);
    await writeFile(outputPath, json, "utf-8");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to write report: ${error.message}`);
    }
    throw error;
  }
}
