import { IDictionary } from "common-types";
import { IAutoindexFile } from "../reference/types";
import { removeExtension } from "../util/removeExtension";

/**
 * Given a set of files and directories that are exportable, this function will
 * boil this down to just the string needed for the autoindex block.
 */
export function defaultExports(ai: IAutoindexFile, opts: IDictionary = {}) {
  const file = (file: string) =>
    `export { default as ${removeExtension(file)} } from "./${
      opts.preserveExtension ? removeExtension(file) + ".js" : removeExtension(file)
    }";\n`;

  const dir = (dir: string) =>
    `export { default as ${removeExtension(dir)} } from "./${dir}/index${
      opts.preserveExtension ? ".js" : ""
    }";\n`;

  const nonVueFiles = ai.files.filter((f) => !f.includes(".vue"));

  return [
    ...(nonVueFiles.length > 0 ? ["// file exports"] : []),
    ...(nonVueFiles.length > 0 ? nonVueFiles.map((f) => file(f)) : []),
    ...(ai.dirs.length > 0 ? ["// directory exports"] : []),
    ...(ai.dirs.length > 0 ? ai.dirs.map((f) => dir(f)) : []),
  ]
    .filter((i) => i)
    .join("\n");
}
