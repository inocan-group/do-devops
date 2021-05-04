import path from "path";
import { IDictionary } from "common-types";
import { DevopsError } from "~/errors";
import {
  getFilesUnderPath,
  dirExists,
  currentDirectory,
  libraryDirectory,
  templateFileCopy,
} from "~/shared/file";

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
export async function templateDirCopy(source: string, target: string, replacements?: IDictionary) {
  source = path.posix.join(libraryDirectory("/templates"), source);
  target = path.posix.join(currentDirectory(), target);

  if (!dirExists(source)) {
    throw new DevopsError(
      `The template directory "${source}" was not found!`,
      "template/source-dir-missing"
    );
  }

  const files = await getFilesUnderPath(source);
  const problems: string[] = [];
  const transferred: string[] = [];
  for (const file of files) {
    const sourceFile = path.posix.join(source, file);
    const targetFile = path.posix.join(target, file);
    const completed = await templateFileCopy(sourceFile, targetFile, replacements);
    if (!completed) {
      problems.push(file);
    } else {
      transferred.push(file);
    }
  }

  return { transferred, ...(problems.length > 0 ? { problems } : {}) };
}
