import { randomUUID } from 'crypto';

type LogLevel = 'INFO' | 'WARN' | 'ERROR';

interface LogContext {
  correlationId?: string;
  shopId?: string;
  messageId?: string;
  [key: string]: unknown;
}

function formatLog(level: LogLevel, event: string, context: LogContext = {}) {
  return JSON.stringify({
    level,
    event,
    ts: new Date().toISOString(),
    ...context,
  });
}

export function createCorrelationId(): string {
  return randomUUID();
}

export function logInfo(event: string, context: LogContext = {}) {
  console.log(formatLog('INFO', event, context));
}

export function logWarn(event: string, context: LogContext = {}) {
  console.warn(formatLog('WARN', event, context));
}

export function logError(event: string, context: LogContext = {}) {
  console.error(formatLog('ERROR', event, context));
}
