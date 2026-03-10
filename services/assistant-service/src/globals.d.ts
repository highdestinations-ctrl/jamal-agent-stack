// Global declarations for Node.js functions and objects
declare var console: {
  log(...args: any[]): void;
  error(...args: any[]): void;
  warn(...args: any[]): void;
  info(...args: any[]): void;
  debug(...args: any[]): void;
};

declare function setTimeout(callback: () => void, ms?: number): NodeJS.Timeout;
declare function clearTimeout(timeoutId: NodeJS.Timeout): void;

namespace NodeJS {
  interface Timeout {
    __timeout: never;
  }
}
