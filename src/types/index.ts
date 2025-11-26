import { z } from "zod";
//Constants
export const MAX_STORED_ENTRIES = 100;
export const LOG_LEVELS = ["INFO", "WARN", "ERROR", "DEBUG"] as const;

export type LogLevel = (typeof LOG_LEVELS)[number];

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  raw: string;
}
export type ParseResult =
  | { success: true; entry: LogEntry }
  | { succsess: false; error: string; raw: string };

/*
 ** Zod Schema For CLI arguments Validation
 */
export const CLIOptionsschema = z.object({
  inputFile: z.string().min(1, "Input file path is required"),
  outputFile: z.string().min(1, "Input file path is required"),
});

//Validate CLI Options
export type CLIOptions = z.infer<typeof CLIOptionsschema>;

export interface LogEvent {
  timestamp: string;
  message: string;
}

/**
 * Metadata about the analysis run
 */

export interface AnalysisMeta {
  analyzedAt: string;
  inputFile: string;
  totalLines: number;
  parsedLines: number;
  parseErrors: number;
}

/**
 * Time range of the analyzed logs
 */

export interface TimeRange {
  start: string;
  end: string;
}
/**
 * Count of entries by log level
 */
export type LevelCounts = Record<LogLevel, number>;

/**
 * Collection of log events with truncation info
 */
export interface EventCollection {
  items: LogEvent[];
  totalCount: number;
  truncated: boolean;
}
/**
 * The final analysis summary written to JSON
 */

export interface AnalysisSummary {
  meta: AnalysisMeta;
  timeRange: TimeRange | null;
  summary: LevelCounts;
  errors: EventCollection;
  warninig: EventCollection;
}
