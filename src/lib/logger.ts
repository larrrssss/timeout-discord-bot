import { green, red, yellow, cyan, Color } from 'colors';

export function success(content: string): void {
  console.log(green(`[SUCCESS] ${content}`));
}

export function error(content: string): void {
  console.log(red(`[ERROR] ${content}`));
}

export function warn(content: string): void {
  console.log(yellow(`[WARN] ${content}`));
}

export function info(content: string): void {
  console.log(`[INFO] ${content}`.cyan);
}

export function getColors(): { cyan: Color } {
  return {
    cyan,
  };
}

export default {
  warn,
  success,
  error,
  info,
  getColors,
};