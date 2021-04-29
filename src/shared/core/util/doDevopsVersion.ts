import { fileExists, libraryDirectory } from "~/shared/file";
import { getPackageJson } from "~/shared/npm";

/**
 * Reports back the NPM version of the `do-devops` library
 */
export function doDevopsVersion() {
  const libPkgJsonFilename = libraryDirectory();
  const version = fileExists(libPkgJsonFilename)
    ? getPackageJson(libPkgJsonFilename).version || "?"
    : "??";

  return version;
}
