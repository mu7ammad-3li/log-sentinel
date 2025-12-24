#!/usr/bin/env node

import { parseArgs } from "./cli/args.js";
import { streamLines } from "./stream/fileStream.js";
import { parseLine } from "./parser/logParser.js";
import { LogAnalyzer } from "./analyzer/analyzer.js";
import { writeReport } from "./output/reporter.js";

/**
 * Main entry point for the log-sentinel CLI
 */
async function main(): Promise<void> {
  try {
    // Parse CLI arguments
    const options = parseArgs();

    console.log(`Analyzing log file: ${options.inputFile}`);
    console.log(`Output will be written to: ${options.outputFile}`);

    // Initialize analyzer
    const analyzer = new LogAnalyzer(options.inputFile);

    // Stream and process log file line-by-line
    await streamLines(options.inputFile, (line) => {
      analyzer.incrementTotalLines();

      const result = parseLine(line);

      if (result.success) {
        analyzer.processEntry(result.entry);
      } else {
        analyzer.recordParseError();
      }
    });

    // Generate summary
    const summary = analyzer.generateSummary();

    // Write report
    await writeReport(summary, options.outputFile);

    console.log("\n✓ Analysis complete!");
    console.log(`Total lines: ${summary.meta.totalLines}`);
    console.log(`Parsed lines: ${summary.meta.parsedLines}`);
    console.log(`Parse errors: ${summary.meta.parseErrors}`);
    console.log(`\nLog level counts:`);
    console.log(`  INFO: ${summary.summary.INFO}`);
    console.log(`  WARN: ${summary.summary.WARN}`);
    console.log(`  ERROR: ${summary.summary.ERROR}`);
    console.log(`  DEBUG: ${summary.summary.DEBUG}`);
    console.log(`\nReport written to: ${options.outputFile}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("An unexpected error occurred");
    }
    process.exit(1);
  }
}

// Run the main function
main();
