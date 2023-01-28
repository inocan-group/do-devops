import chalk from "chalk";
import { spawnSync } from "node:child_process";
import { Options } from "src/@types";
import { DevopsError } from "src/errors";
import { logger } from "src/shared/core";
import { emoji } from "src/shared/ui";
import { currentDirectory, libraryDirectory } from "../base-paths";
import { fileExists } from "../existence";
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
export function tscValidation(filename: string, opts: Options = {}): boolean {
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
    chalk.gray` - validating the "${filename}" file with the Typescript {bold {yellow tsc}} compiler`
  );
  try {
    spawnSync(command, { stdio: "inherit" });
    log.whisper(chalk.dim`- {bold {yellow tsc}} validation passed`);
    return true;
  } catch {
    log.shout(
      `- ${emoji.poop} failed to transpile {blue serverless.ts}: {bold tsc ${
        getFileComponents(filename).filename
      } --noEmit}`
    );
    return false;
  }
}
