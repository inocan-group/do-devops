import { IGlobalOptions } from "~/@types";

export function logger(opts: IGlobalOptions) {
  return {
    info(...args: any[]) {
      if (!opts.quiet) {
        console.log(...args);
      }
    },
    shout(...args: any[]) {
      console.log(...args);
    },
    whisper(...args: any[]) {
      if (opts.verbose) {
        console.log(...args);
      }
    },
  };
}
