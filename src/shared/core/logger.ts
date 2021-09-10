import { IGlobalOptions } from "~/@types";

let options: IGlobalOptions;

export function logger(opts?: IGlobalOptions) {
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
        console.log(...args);
      }
    },
    shout(...args: any[]) {
      console.log(...args);
    },
    whisper(...args: any[]) {
      if (options.verbose) {
        console.log(...args);
      }
    },
  };
}
