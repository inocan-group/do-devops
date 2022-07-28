/* eslint-disable unicorn/prefer-module */
import chalk from "chalk";
import path, { join } from "node:path";
import { IDirectoryOptions } from "src/@types";
import { DevopsError } from "../../../errors/DevopsError";
import { findPackageJson } from "../../../shared/npm";
import { fileExists } from "../existence/fileExists";
import { toRelativePath } from "../relativePath";
import { currentDirectory } from "./currentDirectory";
import { parentDirectory } from "./parentDirectory";

/**
 * Returns the directory which is the root of the repo which
 * the caller is currently in. This directory is determined
 * by moving up directories until a directory is found which
 * has both a `package.json` file and is initialized with
 * git.
 *
 * If this directory is not found a `directory/not-found`
 * error will be thrown.
 */
export function repoDirectory(offset?: string, opts: Omit<IDirectoryOptions, "offset"> = {}) {
  const start = offset ? path.posix.join(process.cwd(), offset) : process.cwd();

  if (fileExists(currentDirectory("package.json"))) {
    // Looks like we've found it already
    return currentDirectory(offset);
  }

  const dir = findPackageJson(parentDirectory());
  if (!dir) {
    throw new DevopsError(
      chalk`Attempt to locate the root of the repo for the current directory failed. No "package.json" was found above the {blue ${start}} directory`,
      "directory/not-found"
    );
  }
  // const gitInitialized = dirExists(path.posix.join(path.dirname(dir), ".git"));
  // if (!gitInitialized) {
  //   throw new DevopsError(chalk`Attempt to locate the root of the repo for the current directory failed. A "package.json" was found above the {blue ${start}} directory but it was {italic not} initialized with {bold {yellow git}}.`, "directory/not-found");
  // }

  const filename = join(dir, offset ? offset : "");

  return opts.base ? toRelativePath(filename, opts.base) : filename;
}
