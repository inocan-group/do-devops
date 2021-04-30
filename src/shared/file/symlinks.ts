import { readlinkSync } from "fs";
import path from "path";
import { directoryFiles } from "./directoryFiles";

/**
 * **symlinks**
 *
 * Given a specified directory, this function will return an array of
 * files and folders which are symlinks. If you wish only files or folders,
 * you can specify this in the optional _filter_ parameter.
 */
export function symlinks(dir: string, filter?: "only-files" | "only-dirs") {
  return directoryFiles(dir)
    .filter((f) => {
      if (!f.stats.isSymbolicLink()) {
        return false;
      }
      if (!filter) {
        return true;
      }

      return filter === "only-dirs" ? f.stats.isDirectory() : !f.stats.isDirectory();
    })
    .map((lnk) => {
      const fullPath = path.posix.join(dir, lnk.file);
      const linkTo = readlinkSync(fullPath, { encoding: "utf-8" });
      return { ...lnk, linkTo };
    });
}
