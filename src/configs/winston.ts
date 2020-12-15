import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import winston from 'winston';

const logDir = path.join(__dirname, '..', 'logs');

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const infoTransport = new winston.transports.File({
  filename: 'info.log',
  dirname: logDir,
  level: 'info',
});

const errorTransport = new winston.transports.File({
  filename: 'error.log',
  dirname: logDir,
  level: 'error',
});

const logger = winston.createLogger({
  transports: [infoTransport, errorTransport],
});

const stream = {
  write: (message: string) => {
    logger.info(message);
  },
};

export { logger, stream };
