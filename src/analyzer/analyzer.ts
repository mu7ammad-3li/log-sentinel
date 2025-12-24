import {
  LogEntry,
  AnalysisSummary,
  AnalysisMeta,
  TimeRange,
  LevelCounts,
  EventCollection,
  LogEvent,
  MAX_STORED_ENTRIES,
  LOG_LEVELS,
} from "../types/index.js";

/**
 * Accumulates log entries and generates analysis summary
 */
export class LogAnalyzer {
  private totalLines = 0;
  private parsedLines = 0;
  private parseErrors = 0;

  private levelCounts: LevelCounts;
  private errors: LogEvent[] = [];
  private warnings: LogEvent[] = [];

  private firstTimestamp: Date | null = null;
  private lastTimestamp: Date | null = null;

  private readonly inputFile: string;

  constructor(inputFile: string) {
    this.inputFile = inputFile;

    // Initialize level counts
    this.levelCounts = {} as LevelCounts;
    for (const level of LOG_LEVELS) {
      this.levelCounts[level] = 0;
    }
  }

  /**
   * Process a successfully parsed log entry
   */
  processEntry(entry: LogEntry): void {
    this.parsedLines++;

    // Update level counts
    this.levelCounts[entry.level]++;

    // Track time range
    if (!this.firstTimestamp || entry.timestamp < this.firstTimestamp) {
      this.firstTimestamp = entry.timestamp;
    }
    if (!this.lastTimestamp || entry.timestamp > this.lastTimestamp) {
      this.lastTimestamp = entry.timestamp;
    }

    // Store errors (up to MAX_STORED_ENTRIES)
    if (entry.level === "ERROR" && this.errors.length < MAX_STORED_ENTRIES) {
      this.errors.push({
        timestamp: entry.timestamp.toISOString(),
        message: entry.message,
      });
    }

    // Store warnings (up to MAX_STORED_ENTRIES)
    if (entry.level === "WARN" && this.warnings.length < MAX_STORED_ENTRIES) {
      this.warnings.push({
        timestamp: entry.timestamp.toISOString(),
        message: entry.message,
      });
    }
  }

  /**
   * Record a parse error
   */
  recordParseError(): void {
    this.parseErrors++;
  }

  /**
   * Increment total lines counter
   */
  incrementTotalLines(): void {
    this.totalLines++;
  }

  /**
   * Generate the final analysis summary
   */
  generateSummary(): AnalysisSummary {
    const meta: AnalysisMeta = {
      analyzedAt: new Date().toISOString(),
      inputFile: this.inputFile,
      totalLines: this.totalLines,
      parsedLines: this.parsedLines,
      parseErrors: this.parseErrors,
    };

    const timeRange: TimeRange | null =
      this.firstTimestamp && this.lastTimestamp
        ? {
            start: this.firstTimestamp.toISOString(),
            end: this.lastTimestamp.toISOString(),
          }
        : null;

    const errorCollection: EventCollection = {
      items: this.errors,
      totalCount: this.levelCounts.ERROR,
      truncated: this.levelCounts.ERROR > MAX_STORED_ENTRIES,
    };

    const warningCollection: EventCollection = {
      items: this.warnings,
      totalCount: this.levelCounts.WARN,
      truncated: this.levelCounts.WARN > MAX_STORED_ENTRIES,
    };

    return {
      meta,
      timeRange,
      summary: this.levelCounts,
      errors: errorCollection,
      warnings: warningCollection,
    };
  }
}
