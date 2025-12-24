import { LogEntry, LogLevel, LOG_LEVELS, ParseResult } from "../types/index.js";

/**
 * Regex pattern for parsing log lines
 * Format: TIMESTAMP [LEVEL] MESSAGE
 * Example: 2024-01-15T08:23:45.123Z [INFO] Server started on port 3000
 */
const LOG_PATTERN =
  /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)\s+\[(INFO|WARN|ERROR|DEBUG)\]\s+(.+)$/;

/**
 * Type guard to check if a string is a valid LogLevel
 */
function isLogLevel(value: string): value is LogLevel {
  return LOG_LEVELS.includes(value as LogLevel);
}

/**
 * Validates that a date string produces a valid Date object
 */
function isValidDate(date: Date): boolean {
  return !isNaN(date.getTime());
}

/**
 * Parse a single log line into a structured LogEntry
 *
 * @param raw - The raw log line string
 * @returns ParseResult - Success with LogEntry or failure with error details
 */
export function parseLine(raw: string): ParseResult {
  const trimmed = raw.trim();

  if (trimmed === "") {
    return {
      success: false,
      error: "Empty line",
      raw,
    };
  }

  const match = LOG_PATTERN.exec(trimmed);

  if (!match) {
    return {
      success: false,
      error: "Line does not match expected format",
      raw,
    };
  }

  const [, timestampStr, levelStr, message] = match;

  // TypeScript knows these exist due to regex structure,
  // but we check anyway for safety with noUncheckedIndexedAccess
  if (!timestampStr || !levelStr || !message) {
    return {
      success: false,
      error: "Failed to extract log components",
      raw,
    };
  }

  if (!isLogLevel(levelStr)) {
    return {
      success: false,
      error: `Invalid log level: ${levelStr}`,
      raw,
    };
  }

  const timestamp = new Date(timestampStr);

  if (!isValidDate(timestamp)) {
    return {
      success: false,
      error: "Invalid timestamp",
      raw,
    };
  }

  const entry: LogEntry = {
    timestamp,
    level: levelStr,
    message,
    raw,
  };

  return {
    success: true,
    entry,
  };
}
