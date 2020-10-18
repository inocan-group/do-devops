import chalk = require("chalk");
import { IDictionary } from "common-types";
import { Stats } from "fs";
import globby = require("globby");
import { posix } from "path";
import { existsSync } from "fs";
import { processFiles } from "./processFiles";
import { directoryFiles, highlightFilepath } from "../../../shared";
import { isAutoindexFile } from "./util";
import { watch } from "chokidar";

type logging = (message?: any, ...optionalParams: any[]) => void;

/** to avoid circular events, we need to allow certain files to be ignored */
let filesToIgnore: string[] = [];

/**
 * configures a watch handler for an `autoindex` watched directory
 */
export function watchHandler(dir: string, options: IDictionary = {}) {
  const log = console.log.bind(console);
  return (evtBeingWatched: string) => {
    return (filepath: string, stats: Stats) => {
      if (filesToIgnore.includes(filepath)) {
        // autoindex file has been changed due to the autoindex processing
        filesToIgnore = filesToIgnore.filter((i) => i !== filepath);
        return;
      }

      /** files in event directory which are autoindex files */
      let indexFiles: string[];

      const fileIsIndexFile = (fp: string) => /(index|private).[tj]s/.test(fp);

      if (fileIsIndexFile(filepath)) {
        filesToIgnore.push(filepath);
        indexFiles = [filepath];
      } else {
        indexFiles = directoryFiles(dir)
          .map((i) => posix.join(dir, i.file))
          .filter((f) => isAutoindexFile(f));
        indexFiles.forEach((i) => filesToIgnore.push(i));
      }

      const isMonoRepo = filepath.includes("packages/");
      const pkg = isMonoRepo ? Array.from(/.*packages\/(\S+?\/)/.exec(filepath))[1] : "";
      const verbLookup: IDictionary = {
        changed: "changed",
        added: "added",
        removed: "removed",
      };
      const verb = Object.keys(verbLookup).includes(evtBeingWatched)
        ? verbLookup[evtBeingWatched]
        : "unknown";
      const message = isMonoRepo
        ? chalk`- the file ${highlightFilepath(
            filepath
          )} in package {italic ${pkg}} was {italic ${evtBeingWatched}} to a watched directory`
        : chalk`- the file ${highlightFilepath(
            filepath
          )} was {italic ${evtBeingWatched}} to a watched directory`;
      if (!fileIsIndexFile(filepath)) {
        log(message);
      } else {
        if (evtBeingWatched === "unlinked") {
          indexFiles = [];
        }
      }

      if (indexFiles.length > 0) {
        processFiles(indexFiles, { ...options, quiet: true }).then(() => log());
      }
    };
  };
}
