import chalk from "chalk";
import { IDictionary } from "common-types";
import path from "path";
import { processFiles } from "./processFiles";
import { directoryFiles } from "~/shared/file";
import { isAutoindexFile } from "./util";
import { highlightFilepath } from "~/shared/ui";

/** to avoid circular events, we need to allow certain files to be ignored */
let filesToIgnore: string[] = [];

/**
 * configures a watch handler for an `autoindex` watched directory
 */
export function watchHandler(dir: string, options: IDictionary = {}) {
  const log = console.log.bind(console);
  return (evtBeingWatched: string) => {
    return (filepath: string) => {
      if (filesToIgnore.includes(filepath)) {
        // autoindex file has been changed due to the autoindex processing itself
        // TODO: why are we removing this from files to ignore?
        filesToIgnore = filesToIgnore.filter((i) => i !== filepath);
        return;
      }

      /** files in event directory which are autoindex files */
      let indexFiles: string[];

      // eslint-disable-next-line unicorn/consistent-function-scoping
      const fileIsIndexFile = (fp: string) => /(index|private).[jt]s/.test(fp);

      if (fileIsIndexFile(filepath)) {
        filesToIgnore.push(filepath);
        indexFiles = [filepath];
      } else {
        indexFiles = directoryFiles(dir)
          .map((i) => path.posix.join(dir, i.file))
          .filter((f) => isAutoindexFile(f));

        filesToIgnore = [...filesToIgnore, ...indexFiles];
      }
      // test for lerna monorepo
      const re = /.*packages\/(\S+?\/)/;
      const [_, pkg] = re.exec(filepath) || [undefined, undefined];

      const message = pkg
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
