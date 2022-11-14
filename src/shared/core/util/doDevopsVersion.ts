import chalk from "chalk";
import { libraryDirectory } from "src/shared/file/base-paths/libraryDirectory";
import { fileExists } from "src/shared/file/existence/fileExists";
import { getPackageJson } from "src/shared/npm";
import { emoji } from "src/shared/ui";

/**
 * Reports back the NPM version of the `do-devops` library
 */
export function doDevopsVersion() {
  const libPkgJsonFilename = libraryDirectory();
  try {
    const version = fileExists(libPkgJsonFilename)
      ? getPackageJson(libPkgJsonFilename).version || "?"
      : "??";

    return version;
  } catch (error) {
    console.log(
      `{gray - ${emoji.poop} failed to detect do-devops version: ${(error as Error).message}}`
    );
    console.log(`{gray - library directory reported as being: ${libPkgJsonFilename}}`);
    return "?";
  }
}
