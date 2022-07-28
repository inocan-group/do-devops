import { Options } from "src/@types";

let options: Options;

export type ILogger = {
  info(...args: any[]): void;
  shout(...args: any[]): void;
  whisper(...args: any[]): void;
};

export function logger(opts?: Options): ILogger {
  if (opts) {
    options = opts;
  } else if (!opts && !options) {
    console.warn(
      `Trying to use logger without having first set global options. Outside of testing, this should be avoided by ensuring all CLI commands set the options up front.`
    );
    options = { verbose: true, quiet: false };
  }

  return {
    info(...args: any[]) {
      if (!options.quiet) {
        console.error(...args);
      }
    },
    shout(...args: any[]) {
      console.error(...args);
    },
    whisper(...args: any[]) {
      if (options.verbose) {
        console.error(...args);
      }
    },
  };
}
