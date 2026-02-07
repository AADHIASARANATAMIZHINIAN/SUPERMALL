const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

winston.addColors(colors);

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}` +
    (info.metadata && Object.keys(info.metadata).length ? ` ${JSON.stringify(info.metadata)}` : '')
  )
);

// Define log format for files (without colors)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: format,
    level: process.env.LOG_LEVEL || 'info'
  }),
  
  // File transport for all logs
  new DailyRotateFile({
    filename: path.join(process.env.LOG_FILE_PATH || './logs', 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: fileFormat,
    level: 'info'
  }),
  
  // File transport for error logs
  new DailyRotateFile({
    filename: path.join(process.env.LOG_FILE_PATH || './logs', 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    format: fileFormat,
    level: 'error'
  }),
  
  // Database transaction logs
  new DailyRotateFile({
    filename: path.join(process.env.LOG_FILE_PATH || './logs', 'database-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    format: fileFormat,
    level: 'info'
  })
];

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  transports,
  exitOnError: false
});

// Create specialized loggers
const dbLogger = winston.createLogger({
  level: 'info',
  format: fileFormat,
  transports: [
    new DailyRotateFile({
      filename: path.join(process.env.LOG_FILE_PATH || './logs', 'database-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d'
    })
  ]
});

const auditLogger = winston.createLogger({
  level: 'info',
  format: fileFormat,
  transports: [
    new DailyRotateFile({
      filename: path.join(process.env.LOG_FILE_PATH || './logs', 'audit-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '90d'
    })
  ]
});

// Helper functions for structured logging
const logDatabaseOperation = (operation, collection, data, userId = null) => {
  dbLogger.info('Database Operation', {
    operation,
    collection,
    userId,
    timestamp: new Date().toISOString(),
    data: JSON.stringify(data)
  });
};

const logAuditEvent = (action, userId, details) => {
  auditLogger.info('Audit Event', {
    action,
    userId,
    timestamp: new Date().toISOString(),
    details: JSON.stringify(details)
  });
};

const logAPIRequest = (method, path, userId, statusCode, responseTime) => {
  logger.http('API Request', {
    method,
    path,
    userId,
    statusCode,
    responseTime: `${responseTime}ms`,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  logger,
  dbLogger,
  auditLogger,
  logDatabaseOperation,
  logAuditEvent,
  logAPIRequest
};
