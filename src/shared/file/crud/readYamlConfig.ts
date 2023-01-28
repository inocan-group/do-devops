import { readFileSync } from "node:fs";
import { load } from "js-yaml";
import { DevopsError } from "src/errors/DevopsError";
import { filesExist } from "../existence/filesExist";
import { interpolateFilePath } from "../helpers";

/**
 * Reads a file from the filesystem and returns as a string.
 *
 * Errors:
 *  - `read-file/unknown`
 *  - `read-yaml-config/unknown`
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
export function readYamlConfig<T extends object>(filename: string): T | undefined {
  filename = interpolateFilePath(filename);
  try {
    return filesExist(filename)
      ? (load(readFileSync(filename, { encoding: "utf8" })) as T)
      : undefined;
  } catch (error) {
    throw new DevopsError(
      `Problem loading YAML config from file {blue ${filename}}: ${(error as Error).message}`,
      "read-yaml-config/unknown"
    );
  }
}
