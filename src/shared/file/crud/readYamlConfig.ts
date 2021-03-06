import chalk from "chalk";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import { DevopsError } from "~/errors/DevopsError";
import { filesExist } from "../existance/filesExist";
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
 * If, however, the filename starts with `~/` or `./` the appropriate base
 * will be deduced as well.
 */
export function readYamlConfig<T extends object>(filename: string): T | undefined {
  filename = interpolateFilePath(filename);
  try {
    return filesExist(filename) ? load(readFileSync(filename, { encoding: "utf-8" })) as T : undefined;
  } catch (error) {
    throw new DevopsError(chalk`Problem loading YAML config from file {blue ${filename}}: ${error.message}`, "read-yaml-config/unknown");
  }
}
