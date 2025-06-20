const COLORS = {
  reset: "\x1b[0m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  gray: "\x1b[90m",
  green: "\x1b[32m",
};

export const logger = {
  info: (message: string, ...args: any[]): void => {
    console.log(`${COLORS.blue}[INFO]${COLORS.reset} ${message}`, ...args);
  },
  error: (message: string, ...args: any[]): void => {
    console.error(`${COLORS.red}[ERROR]${COLORS.reset} ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]): void => {
    console.warn(`${COLORS.yellow}[WARN]${COLORS.reset} ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]): void => {
    console.debug(`${COLORS.gray}[DEBUG]${COLORS.reset} ${message}`, ...args);
  },
  success: (message: string, ...args: any[]): void => {
    console.log(`${COLORS.green}[SUCCESS]${COLORS.reset} ${message}`, ...args);
  },
};
