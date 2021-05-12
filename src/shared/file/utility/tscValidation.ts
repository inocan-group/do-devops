import chalk from "chalk";
import { exec } from "shelljs";
import { IGlobalOptions } from "~/@types";
import { DevopsError } from "~/errors";
import { logger } from "~/shared/core";
import { emoji } from "~/shared/ui";
import { currentDirectory, libraryDirectory } from "../base-paths";
import { fileExists } from "../existance";
import { getFileComponents } from "./getFileComponents";

/**
 * Validates that a given Typescript file can be transpiled by
 * `tsc`.
 *
 * Note: it will use a locally installed version of `tsc` in
 * preference over a globally installed one.
 *
 * Errors:
 *  - `file/file-does-not-exist`
 */
export function tscValidation(filename: string, opts: IGlobalOptions = {}): boolean {
  const log = logger(opts);
  const localTsc = currentDirectory("node_modules/.bin/tsc");
  const localExists = fileExists(localTsc);
  const libraryTsc = libraryDirectory("node_modules/.bin/tsc");
  const tsc = localExists ? localTsc : libraryTsc;

  if (!fileExists(filename)) {
    throw new DevopsError(`The file "${filename}" does not exist!`, "file/file-does-not-exist");
  }

  const command = `${tsc} ${filename} --noEmit`;
  log.whisper(
    chalk`{gray - validating the "${filename}" file with the Typescript {bold {yellow tsc}} compiler}`
  );
  const outcome = exec(command, { silent: true });
  if (outcome.code === 0) {
    log.whisper(chalk`{dim - {bold {yellow tsc}} validation passed}`);
    return true;
  } else {
    log.shout(
      chalk`- ${emoji.poop} failed to transpile {blue serverless.ts}: {bold tsc ${
        getFileComponents(filename).filename
      } --noEmit}`
    );
    log.shout(chalk`\n\t{red ${outcome.stderr}${outcome.stdout}}`);
    return false;
  }
}
