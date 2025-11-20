type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogFormat = 'text' | 'json';

type LogWriter = (message?: any, ...optional: any[]) => void;

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const DEFAULT_LEVEL: LogLevel = 'info';
const DEFAULT_FORMAT: LogFormat = 'text';

// IMPORTANT: For STDIO MCP servers, ALL logging must go to STDERR
// to avoid contaminating the JSON-RPC protocol messages on STDOUT
const WRITERS: Record<LogLevel, LogWriter> = {
  debug: console.error.bind(console),
  info: console.error.bind(console),
  warn: console.error.bind(console),
  error: console.error.bind(console),
};

function parseLogLevel(level?: string): LogLevel {
  if (!level) {
    return DEFAULT_LEVEL;
  }

  const normalized = level.toLowerCase();

  switch (normalized) {
    case 'debug':
    case 'info':
    case 'warn':
    case 'warning':
    case 'error':
      return normalized === 'warning' ? 'warn' : (normalized as LogLevel);
    default:
      return DEFAULT_LEVEL;
  }
}

function parseLogFormat(format?: string): LogFormat {
  if (!format) {
    return DEFAULT_FORMAT;
  }

  const normalized = format.toLowerCase();
  return normalized === 'json' ? 'json' : DEFAULT_FORMAT;
}

export class Logger {
  private level: LogLevel;
  private format: LogFormat;

  constructor(private context: string, options?: { level?: LogLevel; format?: LogFormat }) {
    this.level = options?.level ?? DEFAULT_LEVEL;
    this.format = options?.format ?? DEFAULT_FORMAT;
  }

  static fromEnv(context: string, env: NodeJS.ProcessEnv = process.env): Logger {
    const level = parseLogLevel(env.GHL_MCP_LOG_LEVEL || env.LOG_LEVEL);
    const format = parseLogFormat(env.GHL_MCP_LOG_FORMAT || env.LOG_FORMAT);
    return new Logger(context, { level, format });
  }

  child(suffix: string): Logger {
    return new Logger(`${this.context}:${suffix}`, { level: this.level, format: this.format });
  }

  isLevelEnabled(level: LogLevel): boolean {
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[this.level];
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.write('debug', message, meta);
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.write('info', message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.write('warn', message, meta);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.write('error', message, meta);
  }

  private write(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    if (!this.isLevelEnabled(level)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const writer = WRITERS[level];

    if (this.format === 'json') {
      const payload: Record<string, unknown> = {
        timestamp,
        level,
        context: this.context,
        message,
      };

      if (meta && Object.keys(meta).length > 0) {
        payload.meta = meta;
      }

      writer(JSON.stringify(payload));
      return;
    }

    let line = `[${timestamp}] [${this.context}] ${level.toUpperCase()}: ${message}`;

    if (meta && Object.keys(meta).length > 0) {
      line += ` ${JSON.stringify(meta)}`;
    }

    writer(line);
  }
}

export function createLogger(context: string): Logger {
  return Logger.fromEnv(context);
}

export type { LogLevel, LogFormat };
