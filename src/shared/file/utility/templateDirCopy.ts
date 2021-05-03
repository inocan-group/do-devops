import path from "path";
import { IDictionary } from "common-types";
import { currentDirectory, libraryDirectory } from "../base-paths";
import { dirExists, fileExists } from "../existance";
import { DevopsError } from "~/errors";

/**
 * **templateDirCopy**
 *
 * Copies files from the `do-devops` templates directory to repo's directory structure.
 * If the file already exists in the target location then the user will be interactively
 * asked whether they want to replace this.
 *
 * @param source the relative path to a directory under the `do-devops` _templates_ dir
 * @param target the relative path to the target location off of the repo's root
 * @param replacements optionally state a dictionary of key/value pairs where the KEY will be looked
 * for in the content of the file and replaced with the value in the dictionary.
 *
 * Errors:
 * - `template/source-dir-missing`
 * - `dir/exists-not-dir`
 */
export function templateDirCopy(source: string, target: string, replacements?: IDictionary) {
  source = path.posix.join(libraryDirectory("/templates"), source);
  target = path.posix.join(currentDirectory(), target);

  if (!dirExists(source)) {
    throw new DevopsError(
      `The template directory "${source}" was not found!`,
      "template/source-dir-missing"
    );
  }

  const files = 

  
}
