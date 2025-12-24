import { CLIOptionsSchema, CLIOptions } from "../types/index.js";

/**
 * Parse and validate CLI arguments
 *
 * Expected format: node script.js <inputFile> <outputFile>
 *
 * @returns Validated CLI options
 * @throws Error if validation fails
 */
export function parseArgs(): CLIOptions {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    throw new Error(
      "Usage: log-sentinel <inputFile> <outputFile>\n" +
        "Example: log-sentinel logs.txt report.json",
    );
  }

  const [inputFile, outputFile] = args;

  const result = CLIOptionsSchema.safeParse({
    inputFile,
    outputFile,
  });

  if (!result.success) {
    const errors = result.error.issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("\n");
    throw new Error(`Invalid CLI arguments:\n${errors}`);
  }

  return result.data;
}
