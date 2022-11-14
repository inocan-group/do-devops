
import { readFileSync } from "node:fs";
import { emoji } from "src/shared/ui";
import { filesExist } from "../existence/filesExist";
import { interpolateFilePath } from "../helpers";

/**
 * Reads a file from the filesystem and returns as a string.
 *
 * Errors:
 *  - `read-file/unknown`
 *  - _if the file doesn't exist, will return_ `undefined`
 *
 * Where possible, use the following functions to be explicit about the
 * base directory you are intending:
 *   - `libraryDirectory()`,
 *   - `homeDirectory()`,
 *   - `currentDirectory()`
 *
 * If, however, the filename starts with `src/` or `./` the appropriate base
 * will be deduced as well.
 */
export function readFile(filename: string) {
  filename = interpolateFilePath(filename);

  try {
    return filesExist(filename) ? readFileSync(filename, { encoding: "utf-8" }) : undefined;
  } catch (error) {
    console.log(
      `{red - ${
        emoji.poop
      } ran into a problem reading file {blue ${filename}}.} Error message: ${
        (error as Error).message
      }`
    );
    console.log(`- Stack:{dim \n${(error as Error).stack}}`);

    process.exit(1);
  }
}
