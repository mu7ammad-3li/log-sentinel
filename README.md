# log-sentinel

A memory-efficient CLI tool for analyzing log files. Stream-based parsing with strict TypeScript for reliable log analysis and JSON reporting.

## Features

- **Stream-Based Processing**: Analyze large log files without loading them entirely into memory
- **Comprehensive Statistics**: Track log levels (INFO, WARN, ERROR, DEBUG) with detailed counts
- **Error & Warning Collection**: Automatically extract and store error and warning messages
- **Time Range Analysis**: Calculate the time span covered by your logs
- **JSON Reports**: Generate structured, pretty-printed JSON reports
- **Strict TypeScript**: Type-safe implementation with comprehensive validation
- **Parse Error Tracking**: Monitor and report unparseable log lines

## Installation

```bash
npm install
npm run build
```

## Usage

```bash
npm start <inputFile> <outputFile>
```

### Example

```bash
npm start logs/server.log reports/analysis.json
```

Or using the built version directly:

```bash
node dist/index.js logs/server.log reports/analysis.json
```

## Log Format

The tool expects log lines in the following format:

```
TIMESTAMP [LEVEL] MESSAGE
```

Example:
```
2024-01-15T08:23:45.123Z [INFO] Server started on port 3000
2024-01-15T08:25:30.012Z [WARN] High memory usage detected: 85%
2024-01-15T08:26:15.345Z [ERROR] Failed to connect to external API
```

**Supported Log Levels**: INFO, WARN, ERROR, DEBUG

## Output Format

The generated JSON report includes:

- **meta**: Analysis metadata (timestamp, file info, line counts, parse errors)
- **timeRange**: First and last log timestamps
- **summary**: Count of entries per log level
- **errors**: Collection of ERROR entries (up to 100)
- **warnings**: Collection of WARN entries (up to 100)

### Example Output

```json
{
  "meta": {
    "analyzedAt": "2024-01-15T10:30:00.000Z",
    "inputFile": "server.log",
    "totalLines": 1500,
    "parsedLines": 1498,
    "parseErrors": 2
  },
  "timeRange": {
    "start": "2024-01-15T08:00:00.000Z",
    "end": "2024-01-15T09:59:59.999Z"
  },
  "summary": {
    "INFO": 1200,
    "WARN": 250,
    "ERROR": 45,
    "DEBUG": 3
  },
  "errors": {
    "items": [
      {
        "timestamp": "2024-01-15T08:26:15.345Z",
        "message": "Failed to connect to external API"
      }
    ],
    "totalCount": 45,
    "truncated": false
  },
  "warnings": {
    "items": [
      {
        "timestamp": "2024-01-15T08:25:30.012Z",
        "message": "High memory usage detected: 85%"
      }
    ],
    "totalCount": 250,
    "truncated": true
  }
}
```

## Development

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run in development mode with tsx
- `npm start` - Run the compiled application
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Project Structure

```
log-sentinel/
├── src/
│   ├── analyzer/       # Log analysis and statistics
│   ├── cli/            # CLI argument parsing
│   ├── output/         # JSON report generation
│   ├── parser/         # Log line parsing
│   ├── stream/         # File streaming utilities
│   ├── types/          # TypeScript type definitions
│   └── index.ts        # Main entry point
├── dist/               # Compiled output
└── package.json
```

## Technical Details

- **Language**: TypeScript with strict mode enabled
- **Runtime**: Node.js (ES2022, ESM modules)
- **Validation**: Zod for runtime type checking
- **Streaming**: Native Node.js streams and readline
- **Memory Efficiency**: 64KB buffer with line-by-line processing

## License

ISC

## Author

Muhammad Ali

## Repository

[https://github.com/mu7ammad-3li/log-sentinel](https://github.com/mu7ammad-3li/log-sentinel)
