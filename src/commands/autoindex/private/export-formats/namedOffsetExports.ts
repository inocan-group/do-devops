import { IExportableSymbols, removeExtension, exportTemplate } from "../index";

import { IDictionary } from "common-types";

/**
 * Given a set of files and directories that are exportable, this function will
 * boil this down to just the string needed for the autoindex block.
 */
export function namedOffsetExports(exportable: IExportableSymbols, opts: IDictionary = {}) {
  const file = (file: string) =>
    `export * as ${removeExtension(file, true)} from "./${
      opts.preserveExtension ? removeExtension(file) + ".js" : removeExtension(file)
    }";`;

  const dir = (dir: string) => `export * as ${dir} from "./${dir}/index${opts.preserveExtension ? ".js" : ""}";`;

  return exportTemplate(exportable, opts, file, dir);
}
