import { IExportableSymbols, removeExtension, exportTemplate } from "../index";
import { IDictionary } from "common-types";

/**
 * Given a set of files and directories that are exportable, this function will
 * boil this down to just the string needed for the autoindex block.
 */
export function defaultExports(exportable: IExportableSymbols, opts: IDictionary = {}) {
  const file = (file: string) =>
    `export {  default as ${removeExtension(file)} } from "./${
      opts.preserveExtension ? removeExtension(file) + ".js" : removeExtension(file)
    }";`;

  const dir = (dir: string) =>
    `export {  default as ${removeExtension(dir)} } from "./${dir}/index${
      opts.preserveExtension ? ".js" : ""
    }";`;

  return exportTemplate(exportable, opts, { file, dir });
}
