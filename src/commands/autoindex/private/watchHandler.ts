import chalk = require("chalk");
import { IDictionary } from "common-types";
import { Stats } from "fs";
import globby = require("globby");
import { posix } from "path";
import { existsSync } from "fs";
import { processFiles } from "./processFiles";

type logging = (message?: any, ...optionalParams: any[]) => void;

export function watchHandlers(
  /**
   * pass in individual files or a single directory
   */
  indexFiles: string | string[],
  log: logging,
  options: IDictionary = {}
) {
  return (evt: string) => {
    if (typeof indexFiles === "string") {
      const buildIndex = (dir: string) => {
        if (existsSync(posix.join(dir, "index.ts"))) {
          return [posix.join(dir, "index.ts")];
        } else if (existsSync(posix.join(dir, "index.js"))) {
          return [posix.join(dir, "index.js")];
        } else {
          return [];
        }
      };
      indexFiles = buildIndex(indexFiles);
    }

    return (path: string, stats: Stats) => {
      console.log({ path });

      const isMonoRepo = path.startsWith("packages");
      const pkg = isMonoRepo ? path.split("/")[1] : undefined;
      const file = path.split("/").pop();
      const verbLookup: IDictionary = {
        changed: "changed",
        added: "added",
        removed: "removed",
      };
      const verb = Object.keys(verbLookup).includes(evt) ? verbLookup[evt] : "unknown";
      const message = isMonoRepo
        ? chalk`- the file {blue ${file}} in package {italic ${pkg}} was ${evt}`
        : chalk`- the file {blue ${file}} was ${evt}`;
      log(message);
      const files: string[] = isMonoRepo
        ? (indexFiles as string[]).filter((p) => p.includes(`packages/${pkg}`))
        : (indexFiles as string[]);
      processFiles(files, { ...options, quiet: true });
    };
  };
}
