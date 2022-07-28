import path from "node:path";
import { IDictionary } from "common-types";
import { currentDirectory, libraryDirectory } from "../base-paths";
import { DevopsError } from "src/errors";
import { readFile, write } from "../crud";
import { fileExists } from "../existance";
import { askAboutFileOverwrite } from "src/shared/interactive";

/**
 * **templateFileCopy**
 *
 * Copies files from the `do-devops` templates directory to repo's directory structure.
 * If the file already exists in the target location then the user will be interactively
 * asked whether they want to replace this.
 *
 * @param source the relative path to the template file in `do-devops`
 * @param target the relative path to the target location off of the repo's root
 * @param replacements optionally state a dictionary of key/value pairs where the KEY will be looked
 * for in the content of the file and replaced with the value in the dictionary.
 *
 * Errors:
 * - `template/source-file-missing`
 */
export async function templateFileCopy(source: string, target: string, replacements?: IDictionary) {
  source = path.posix.join(libraryDirectory("/templates"), source);
  target = path.posix.join(currentDirectory(), target);

  let content = readFile(source);
  if (content === undefined) {
    throw new DevopsError(
      `The template file "${source}" was not found!`,
      "template/source-file-missing"
    );
  }

  if (replacements) {
    for (const lookFor of Object.keys(replacements)) {
      const re = new RegExp(lookFor, "g");
      content = content.replace(re, replacements[lookFor]);
    }
  }

  if (fileExists(target)) {
    const copy = await askAboutFileOverwrite(source, target);
    if (copy) {
      write(target, content, { allowOverwrite: true });
    } else {
      return false;
    }
  } else {
    write(target, content);
  }

  return true;
}
