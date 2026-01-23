/**
 * @outfitter/logging
 *
 * Structured logging via logtape with automatic sensitive data redaction.
 * Provides consistent log formatting across CLI, MCP, and server contexts.
 *
 * @packageDocumentation
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Log levels supported by the logger, ordered from lowest to highest severity.
 * "silent" is a special level that disables all logging.
 */
export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal" | "silent";

/**
 * A structured log record containing all information about a log event.
 */
export interface LogRecord {
	/** Unix timestamp in milliseconds when the log was created */
	timestamp: number;

	/** Severity level of the log */
	level: Exclude<LogLevel, "silent">;

	/** Logger category/name (e.g., "my-service", "api") */
	category: string;

	/** Human-readable log message */
	message: string;

	/** Structured metadata attached to the log */
	metadata?: Record<string, unknown>;
}

/**
 * Formatter interface for converting log records to strings.
 */
export interface Formatter {
	/** Format a log record into a string representation */
	format(record: LogRecord): string;
}

/**
 * Sink interface for outputting log records to various destinations.
 */
export interface Sink {
	/** Write a log record (optionally with pre-formatted string) */
	write(record: LogRecord, formatted?: string): void;

	/** Optional formatter specific to this sink */
	formatter?: Formatter;

	/** Optional async flush to ensure all pending writes complete */
	flush?(): Promise<void>;
}

/**
 * Redaction configuration for sensitive data scrubbing.
 */
export interface RedactionConfig {
	/** Enable or disable redaction (default: true) */
	enabled?: boolean;

	/** Additional regex patterns to match and redact */
	patterns?: RegExp[];

	/** Additional key names whose values should be redacted */
	keys?: string[];

	/** Replacement string (default: "[REDACTED]") */
	replacement?: string;
}

/**
 * Configuration options for creating a logger.
 */
export interface LoggerConfig {
	/** Logger name/category */
	name: string;

	/** Minimum log level to output (default: "info") */
	level?: LogLevel;

	/** Initial context metadata to attach to all logs */
	context?: Record<string, unknown>;

	/** Sinks to output logs to */
	sinks?: Sink[];

	/** Redaction configuration */
	redaction?: RedactionConfig;
}

/**
 * Logger instance with methods for each log level.
 */
export interface LoggerInstance {
	/** Log at trace level */
	trace(message: string, metadata?: Record<string, unknown>): void;

	/** Log at debug level */
	debug(message: string, metadata?: Record<string, unknown>): void;

	/** Log at info level */
	info(message: string, metadata?: Record<string, unknown>): void;

	/** Log at warn level */
	warn(message: string, metadata?: Record<string, unknown>): void;

	/** Log at error level */
	error(message: string, metadata?: Record<string, unknown>): void;

	/** Log at fatal level */
	fatal(message: string, metadata?: Record<string, unknown>): void;

	/** Get the current context metadata */
	getContext(): Record<string, unknown>;

	/** Set the minimum log level at runtime */
	setLevel(level: LogLevel): void;

	/** Add a sink at runtime */
	addSink(sink: Sink): void;
}

/**
 * Options for pretty (human-readable) formatter.
 */
export interface PrettyFormatterOptions {
	/** Enable ANSI colors in output (default: true) */
	colors?: boolean;

	/** Include timestamp in output (default: true) */
	timestamp?: boolean;
}

/**
 * Options for file sink.
 */
export interface FileSinkOptions {
	/** Path to the log file */
	path: string;

	/** Append to existing file (default: true) */
	append?: boolean;
}

/**
 * Global redaction configuration options.
 */
export interface GlobalRedactionConfig {
	/** Additional regex patterns to match and redact globally */
	patterns?: RegExp[];

	/** Additional key names whose values should be redacted globally */
	keys?: string[];
}

// ============================================================================
// Stub Implementations - Minimal no-op stubs for TDD red phase
// ============================================================================

// Track all created loggers for flush()
const registeredSinks: Sink[] = [];

/**
 * Create a no-op logger instance stub.
 * This is a minimal implementation that allows tests to run and fail on
 * assertions rather than on instantiation.
 *
 * @internal
 */
function createNoOpLogger(config: LoggerConfig): LoggerInstance {
	const context = { ...config.context };
	// Store level for potential use in filtering (stub doesn't filter)
	const state = { level: config.level ?? ("info" as LogLevel) };
	const sinks = [...(config.sinks ?? [])];

	// Track sinks for flush
	for (const sink of sinks) {
		if (!registeredSinks.includes(sink)) {
			registeredSinks.push(sink);
		}
	}

	// No-op log method - does nothing in stub
	const noop = (_message: string, _metadata?: Record<string, unknown>): void => {
		// Stub: no-op
	};

	return {
		trace: noop,
		debug: noop,
		info: noop,
		warn: noop,
		error: noop,
		fatal: noop,
		getContext: () => ({ ...context }),
		setLevel: (level: LogLevel) => {
			state.level = level;
		},
		addSink: (sink: Sink) => {
			sinks.push(sink);
			if (!registeredSinks.includes(sink)) {
				registeredSinks.push(sink);
			}
		},
	};
}

/**
 * Create a configured logger instance.
 *
 * @param config - Logger configuration options
 * @returns Configured LoggerInstance
 *
 * @example
 * ```typescript
 * const logger = createLogger({
 *   name: "my-service",
 *   level: "debug",
 *   redaction: { enabled: true },
 * });
 *
 * logger.info("Server started", { port: 3000 });
 * ```
 */
export function createLogger(config: LoggerConfig): LoggerInstance {
	return createNoOpLogger(config);
}

/**
 * Create a child logger with merged context from a parent logger.
 *
 * @param parent - Parent logger instance
 * @param context - Additional context to merge with parent context
 * @returns Child LoggerInstance with merged context
 *
 * @example
 * ```typescript
 * const parent = createLogger({ name: "app", context: { service: "api" } });
 * const child = createChildLogger(parent, { handler: "getUser" });
 * // child has context: { service: "api", handler: "getUser" }
 * ```
 */
export function createChildLogger(
	parent: LoggerInstance,
	context: Record<string, unknown>,
): LoggerInstance {
	// Merge parent context with child context
	const mergedContext = { ...parent.getContext(), ...context };
	return createLogger({ name: "child", context: mergedContext });
}

/**
 * Create a JSON formatter for structured log output.
 *
 * @returns Formatter that outputs JSON strings
 *
 * @example
 * ```typescript
 * const formatter = createJsonFormatter();
 * const output = formatter.format(record);
 * // {"timestamp":1705936800000,"level":"info","message":"Hello",...}
 * ```
 */
export function createJsonFormatter(): Formatter {
	return {
		format: (record: LogRecord): string => {
			const output = {
				timestamp: record.timestamp,
				level: record.level,
				category: record.category,
				message: record.message,
				...record.metadata,
			};
			return JSON.stringify(output);
		},
	};
}

/**
 * Create a human-readable formatter with optional colors.
 *
 * @param options - Formatter options
 * @returns Formatter that outputs human-readable strings
 *
 * @example
 * ```typescript
 * const formatter = createPrettyFormatter({ colors: true });
 * const output = formatter.format(record);
 * // 2024-01-22T12:00:00.000Z [INFO] my-service: Hello world
 * ```
 */
export function createPrettyFormatter(options?: PrettyFormatterOptions): Formatter {
	const useColors = options?.colors ?? true;

	// ANSI color codes for different levels
	const levelColors: Record<string, string> = {
		trace: "\u001b[90m", // gray
		debug: "\u001b[36m", // cyan
		info: "\u001b[32m", // green
		warn: "\u001b[33m", // yellow
		error: "\u001b[31m", // red
		fatal: "\u001b[35m", // magenta
	};
	const reset = "\u001b[0m";

	return {
		format: (record: LogRecord): string => {
			const timestamp = new Date(record.timestamp).toISOString();
			const level = record.level.toUpperCase();
			const colorCode = useColors ? (levelColors[record.level] ?? "") : "";
			const resetCode = useColors ? reset : "";

			return `${timestamp} ${colorCode}[${level}]${resetCode} ${record.category}: ${record.message}`;
		},
	};
}

/**
 * Create a console sink that writes to stdout/stderr.
 * Info and below go to stdout, warn and above go to stderr.
 *
 * @returns Sink configured for console output
 *
 * @example
 * ```typescript
 * const logger = createLogger({
 *   name: "app",
 *   sinks: [createConsoleSink()],
 * });
 * ```
 */
export function createConsoleSink(): Sink {
	const formatter = createPrettyFormatter();

	return {
		formatter,
		write: (record: LogRecord, formatted?: string): void => {
			const output = formatted ?? formatter.format(record);
			const outputWithNewline = output.endsWith("\n") ? output : `${output}\n`;

			// warn, error, fatal go to stderr; others go to stdout
			if (record.level === "warn" || record.level === "error" || record.level === "fatal") {
				process.stderr.write(outputWithNewline);
			} else {
				process.stdout.write(outputWithNewline);
			}
		},
	};
}

/**
 * Create a file sink that writes to a specified file path.
 *
 * @param options - File sink options
 * @returns Sink configured for file output
 *
 * @example
 * ```typescript
 * const logger = createLogger({
 *   name: "app",
 *   sinks: [createFileSink({ path: "/var/log/app.log" })],
 * });
 * ```
 */
export function createFileSink(options: FileSinkOptions): Sink {
	const formatter = createJsonFormatter();
	const pendingWrites: string[] = [];

	const sink: Sink = {
		formatter,
		write: (record: LogRecord, formatted?: string): void => {
			const output = formatted ?? formatter.format(record);
			const outputWithNewline = output.endsWith("\n") ? output : `${output}\n`;
			pendingWrites.push(outputWithNewline);
		},
		flush: async (): Promise<void> => {
			if (pendingWrites.length > 0) {
				const content = pendingWrites.join("");
				pendingWrites.length = 0;
				// Stub: basic write (proper implementation would handle append mode)
				const file = Bun.file(options.path);
				const existing = options.append !== false ? await file.text().catch(() => "") : "";
				await Bun.write(file, existing + content);
			}
		},
	};

	// Register for global flush
	registeredSinks.push(sink);

	return sink;
}

// Global redaction config storage
const globalRedactionConfig: GlobalRedactionConfig = {
	patterns: [],
	keys: [],
};

/**
 * Configure global redaction patterns and keys that apply to all loggers.
 *
 * @param config - Global redaction configuration
 *
 * @example
 * ```typescript
 * configureRedaction({
 *   patterns: [/custom-secret-\d+/g],
 *   keys: ["myCustomKey"],
 * });
 * ```
 */
export function configureRedaction(config: GlobalRedactionConfig): void {
	if (config.patterns) {
		globalRedactionConfig.patterns = [
			...(globalRedactionConfig.patterns ?? []),
			...config.patterns,
		];
	}
	if (config.keys) {
		globalRedactionConfig.keys = [...(globalRedactionConfig.keys ?? []), ...config.keys];
	}
}

/**
 * Flush all pending log writes across all sinks.
 * Call this before process exit to ensure all logs are written.
 *
 * @returns Promise that resolves when all sinks have flushed
 *
 * @example
 * ```typescript
 * logger.info("Shutting down");
 * await flush();
 * process.exit(0);
 * ```
 */
export async function flush(): Promise<void> {
	await Promise.all(
		registeredSinks.map(async (sink) => {
			if (sink.flush) {
				await sink.flush();
			}
		}),
	);
}
