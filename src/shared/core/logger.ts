import { GlobalOptions } from "src/@types";

let options: GlobalOptions;

export type ILogger = {
  info(...args: any[]): void;
  shout(...args: any[]): void;

  dryRun(...args: any[]): void;
  whisper(...args: any[]): void;
};

export function logger(opts?: GlobalOptions): ILogger {
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
    dryRun(...args: any[]) {
      if(options.dryRun) {
        args[0] = `- [DRY RUN] ${args[0]}`;
        console.log(...args);
      }
    },
    whisper(...args: any[]) {
      if (options.verbose) {
        console.error(...args);
      }
    },
  };
}
